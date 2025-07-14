import { NextResponse } from "next/server";
import Church from "@/lib/models/Church";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth.config";
import { Church as ChurchType } from "@/types";

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
    const { step, ...churchData }: { step: number } & ChurchType = body;
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
        website: churchData.website || "",
        services: [],
        isFeatured: false,
        step: 1,
        status: "draft",
        createdBy: session.user.id,
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
      if (churchData.website !== undefined) {
        church.website = churchData.website;
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
      if (churchData.website !== undefined) {
        church.website = churchData.website;
      }
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

// Update church status (PATCH method)
export async function PATCH(request: Request) {
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
    const { status } = body;

    // Find the church for the current user
    const church = await Church.findOne({ createdBy: session.user.id });
    if (!church) {
      return NextResponse.json(
        { success: false, message: "Church not found" },
        { status: 404 }
      );
    }

    // Update status
    if (status) {
      church.status = status;
    }

    await church.save();

    return NextResponse.json({
      success: true,
      data: {
        _id: church._id,
        status: church.status,
      },
    });
  } catch (error) {
    console.error("Error updating church status:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Dashboard-specific church operations (requires authentication)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);

    // Get user's church for dashboard
    const createdBy = searchParams.get("createdBy");
    if (createdBy && createdBy === session.user.id) {
      const church = await Church.findOne({ createdBy });
      return NextResponse.json({
        success: true,
        data: church || null,
      });
    }

    // Get church by ID for dashboard operations
    const churchId = searchParams.get("churchId");
    if (churchId) {
      const church = await Church.findById(churchId);
      if (!church) {
        return NextResponse.json(
          { success: false, message: "Church not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: church,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid request parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching church for dashboard:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
