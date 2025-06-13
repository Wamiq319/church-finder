import { NextResponse } from "next/server";
import Church from "@/lib/models/Church";
import dbConnect from "@/lib/dbConnect";
import { ChurchData } from "@/types/church.type";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Create a new church
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
    const churchData: ChurchData = body;

    // Check if user already has a church
    const existingChurch = await Church.findOne({ createdBy: session.user.id });
    if (existingChurch) {
      return NextResponse.json(
        { success: false, message: "You have already created a church" },
        { status: 400 }
      );
    }

    const church = new Church({
      ...churchData,
      status: "published",
      createdBy: session.user.id,
    });

    await church.save();

    return NextResponse.json(
      {
        success: true,
        message: "Church created successfully",
        data: {
          id: church._id,
          name: church.name,
          slug: church.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating church:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
}

// Get churches with filtering and pagination
export async function GET(request: Request) {
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
