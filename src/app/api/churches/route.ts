import { NextResponse } from "next/server";
import Church from "@/lib/models/Church";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth.config";

import {
  validateBasicInfo,
  validateLocation,
  validateContact,
  validatePromotion,
} from "@/lib/validations/church";

// Create or update church based on step
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
    const { step, ...churchData } = body;
    console.log("POST /api/churches - Received data:", body);

    // Step-based validation
    let validationResult: { success: boolean; error?: { issues: any[] } };
    if (step === 1) validationResult = validateBasicInfo(churchData);
    else if (step === 2) validationResult = validateLocation(churchData);
    else if (step === 3) validationResult = validateContact(churchData);
    else if (step === 4) validationResult = validatePromotion(churchData);
    else validationResult = { success: true };

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid data for this step.",
          errors: validationResult.error?.issues,
        },
        { status: 400 }
      );
    }

    let church = await Church.findOne({ createdBy: session.user.id });
    const isNewChurch = !church;

    const generateSlug = (name: string) =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    if (isNewChurch) {
      if (step !== 1) {
        return NextResponse.json(
          {
            success: false,
            message: "Please complete step 1 first to create a new church.",
          },
          { status: 400 }
        );
      }
      church = new Church({
        name: churchData.name,
        denomination: churchData.denomination,
        description: churchData.description,
        image: churchData.image,
        address: "",
        state: "",
        city: "",
        pastorName: "",
        pastorEmail: "",
        pastorPhone: "",
        contactEmail: "",
        contactPhone: "",
        services: [],
        isFeatured: false,
        step: 1,
        status: "draft",
        createdBy: session.user.id,
        slug: generateSlug(churchData.name),
        events: [],
      });
    }

    if (!church) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Internal server error: Church object is null after initialization.",
        },
        { status: 500 }
      );
    }

    // Update church fields based on the current step
    if (step === 1) {
      church.name = churchData.name;
      church.denomination = churchData.denomination;
      church.description = churchData.description;
      church.image = churchData.image;
      if (church.isModified("name")) {
        church.slug = generateSlug(churchData.name);
      }
    } else if (step === 2) {
      if (!church || church.step < 1) {
        return NextResponse.json(
          { success: false, message: "Please complete previous steps first." },
          { status: 400 }
        );
      }
      church.address = churchData.address;
      church.state = churchData.state;
      church.city = churchData.city;
    } else if (step === 3) {
      if (!church || church.step < 2) {
        return NextResponse.json(
          { success: false, message: "Please complete previous steps first." },
          { status: 400 }
        );
      }
      church.pastorName = churchData.pastorName;
      church.pastorEmail = churchData.pastorEmail;
      church.pastorPhone = churchData.pastorPhone;
      church.contactEmail = churchData.contactEmail;
      church.contactPhone = churchData.contactPhone;
      church.services = churchData.services;
    } else if (step === 4) {
      if (!church || church.step < 3) {
        return NextResponse.json(
          { success: false, message: "Please complete previous steps first." },
          { status: 400 }
        );
      }
      church.isFeatured = churchData.isFeatured;
      church.status = "published";
    }

    church.step = step;
    church.status = step === 4 ? "published" : "draft";

    await church.save({ validateBeforeSave: false });

    if (isNewChurch) {
      await User.findByIdAndUpdate(session.user.id, { church: church._id });
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: church._id,
        step: church.step,
        status: church.status,
      },
    });
  } catch (error) {
    console.error("Error saving church:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get churches with advanced filtering
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    // Filter by createdBy
    const createdBy = searchParams.get("createdBy");
    if (createdBy) {
      // If createdBy is present, return single church object
      const church = await Church.findOne({ createdBy });
      return NextResponse.json({
        success: true,
        data: church || null,
      });
    }

    // For other cases, use the existing filtering logic
    const query: any = { status: "published" };

    // Filter by event
    const eventId = searchParams.get("eventId");
    if (eventId) {
      query.events = eventId;
    }

    // Filter by other fields
    const filters = ["state", "city", "denomination", "isFeatured"];
    filters.forEach((filter) => {
      const value = searchParams.get(filter);
      if (value) {
        query[filter] =
          value === "true" ? true : value === "false" ? false : value;
      }
    });

    // Search in name and description
    const search = searchParams.get("search");
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Fields selection
    const fields = searchParams.get("fields");
    const projection = fields
      ? fields.split(",").reduce((acc, field) => {
          acc[field.trim()] = 1;
          return acc;
        }, {} as Record<string, number>)
      : {};

    // Fetch churches with pagination
    const [churches, total] = await Promise.all([
      Church.find(query)
        .select(projection)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Church.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        churches,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching churches:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
