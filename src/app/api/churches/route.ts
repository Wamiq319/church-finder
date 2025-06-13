import { NextResponse } from "next/server";
import Church from "@/lib/models/Church";
import dbConnect from "@/lib/dbConnect";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
    console.log(step, churchData);

    // Step-based validation
    let validationResult;
    if (step === 1) validationResult = validateBasicInfo(churchData);
    else if (step === 2) validationResult = validateLocation(churchData);
    else if (step === 3) validationResult = validateContact(churchData);
    else if (step === 4) validationResult = validatePromotion(churchData);
    else validationResult = { success: true };

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid data for this step." },
        { status: 400 }
      );
    }

    // Find existing church for the user
    let church = await Church.findOne({ createdBy: session.user.id });

    // Generate slug from church name
    const generateSlug = (name: string) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    };

    // Step 1: Create new church if none exists
    if (step === 1) {
      if (!church) {
        // Create new church with only step 1 data
        church = new Church({
          name: churchData.name,
          denomination: churchData.denomination,
          description: churchData.description,
          image: churchData.image,
          step: 1,
          status: "draft",
          createdBy: session.user.id,
          slug: generateSlug(churchData.name),
        });
      } else {
        // Update existing church with step 1 data
        church.name = churchData.name;
        church.denomination = churchData.denomination;
        church.description = churchData.description;
        church.image = churchData.image;
        // Update slug if name changes
        if (church.name !== churchData.name) {
          church.slug = generateSlug(churchData.name);
        }
      }
    } else {
      // For steps 2-4, church must exist
      if (!church) {
        return NextResponse.json(
          { success: false, message: "Please complete step 1 first." },
          { status: 400 }
        );
      }

      // Update church based on step
      if (step === 2) {
        church.address = churchData.address;
        church.state = churchData.state;
        church.city = churchData.city;
      } else if (step === 3) {
        church.pastorName = churchData.pastorName;
        church.pastorEmail = churchData.pastorEmail;
        church.pastorPhone = churchData.pastorPhone;
        church.contactEmail = churchData.contactEmail;
        church.contactPhone = churchData.contactPhone;
        church.services = churchData.services;
      } else if (step === 4) {
        church.isFeatured = churchData.isFeatured;
        church.status = "published";
      }
    }

    // Update step
    church.step = step;

    // Save with validation disabled for partial updates
    await church.save({ validateBeforeSave: false });

    return NextResponse.json({
      success: true,
      data: {
        id: church._id,
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

// Get church by user ID and step
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
    const step = searchParams.get("step");

    const query: any = { createdBy: session.user.id };
    if (step) {
      query.step = parseInt(step);
    }

    const church = await Church.findOne(query);

    if (!church) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: church,
    });
  } catch (error) {
    console.error("Error fetching church:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching church" },
      { status: 500 }
    );
  }
}

// Get churches with filtering and pagination
export async function GET_ALL(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    // Filter parameters
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const denomination = searchParams.get("denomination");
    const search = searchParams.get("search");
    const isFeatured = searchParams.get("isFeatured");
    const userId = searchParams.get("userId");

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query
    const query: any = { status: "published" };
    if (state) query.state = state;
    if (city) query.city = city;
    if (denomination) query.denomination = denomination;
    if (isFeatured) query.isFeatured = isFeatured === "true";
    if (userId) query.createdBy = userId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch churches with pagination
    const [churches, total] = await Promise.all([
      Church.find(query)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
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

// Get church by ID
export async function GET_BY_ID(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Church ID is required" },
        { status: 400 }
      );
    }

    const church = await Church.findById(id);
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
  } catch (error) {
    console.error("Error fetching church:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get church by user ID (for dashboard)
export async function GET_BY_USER(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const church = await Church.findOne({ createdBy: session.user.id });

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
  } catch (error) {
    console.error("Error fetching church:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update church
export async function PUT(request: Request) {
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
    const { id, ...updateData } = body;

    const church = await Church.findOne({
      _id: id,
      createdBy: session.user.id,
    });
    if (!church) {
      return NextResponse.json(
        { success: false, message: "Church not found" },
        { status: 404 }
      );
    }

    Object.assign(church, updateData);
    await church.save();

    return NextResponse.json({
      success: true,
      message: "Church updated successfully",
      data: church,
    });
  } catch (error) {
    console.error("Error updating church:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete church
export async function DELETE(request: Request) {
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
    const id = searchParams.get("id");

    const church = await Church.findOneAndDelete({
      _id: id,
      createdBy: session.user.id,
    });
    if (!church) {
      return NextResponse.json(
        { success: false, message: "Church not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Church deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting church:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
