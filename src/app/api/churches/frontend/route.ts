import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Church from "@/lib/models/Church";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "featured", "single", "list"
    const churchId = searchParams.get("churchId"); // For single church lookup
    const slug = searchParams.get("slug"); // For single church lookup by slug
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await dbConnect();

    // Base query for published churches only
    const baseQuery = { status: "published" };
    console.log("Frontend churches API called with type:", type);

    switch (type) {
      case "single":
        // Get single church by ID or slug
        if (!churchId && !slug) {
          return NextResponse.json(
            { success: false, message: "Church ID or slug is required" },
            { status: 400 }
          );
        }

        let church = null;
        if (churchId) {
          // Try to find by ObjectId first
          if (mongoose.Types.ObjectId.isValid(churchId)) {
            church = await Church.findById(churchId);
          }
        }
        // If not found by ID, try by slug
        if (!church && slug) {
          church = await Church.findOne({ slug, status: "published" });
        }

        if (!church) {
          return NextResponse.json(
            { success: false, message: "Church not found" },
            { status: 404 }
          );
        }

        console.log("Found single church:", church.name);
        return NextResponse.json({ success: true, data: church });

      case "featured":
        // Get featured churches (most recent 6)
        const featuredChurches = await Church.find({
          ...baseQuery,
          isFeatured: true,
        })
          .sort({ createdAt: -1 })
          .limit(6)
          .select("name description image city state slug denomination");

        console.log("Found featured churches:", featuredChurches.length);
        return NextResponse.json({ success: true, data: featuredChurches });

      case "list":
        // Get paginated list of all published churches
        const search = searchParams.get("search");
        const state = searchParams.get("state");
        const city = searchParams.get("city");
        const denomination = searchParams.get("denomination");

        // Build query
        const query: any = { ...baseQuery };

        // Search by location (city, state)
        if (search) {
          const locationParts = search.split(",").map((part) => part.trim());
          if (locationParts.length === 2) {
            // User searched for "City, State" format
            const [searchCity, searchState] = locationParts;
            query.$and = [
              { city: { $regex: searchCity, $options: "i" } },
              { state: { $regex: searchState, $options: "i" } },
            ];
          } else if (locationParts.length === 1) {
            // User searched for just city or state
            query.$or = [
              { city: { $regex: search, $options: "i" } },
              { state: { $regex: search, $options: "i" } },
            ];
          }
        }

        // Filter by specific fields
        if (state) query.state = { $regex: state, $options: "i" };
        if (city) query.city = { $regex: city, $options: "i" };
        if (denomination)
          query.denomination = { $regex: denomination, $options: "i" };

        const [churches, total] = await Promise.all([
          Church.find(query)
            .sort({ isFeatured: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select(
              "name description image city state slug denomination isFeatured"
            ),
          Church.countDocuments(query),
        ]);

        console.log(
          "Found churches for list:",
          churches.length,
          "Total:",
          total
        );
        return NextResponse.json({
          success: true,
          data: churches,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
          },
        });

      default:
        // Default: return recent published churches
        const recentChurches = await Church.find(baseQuery)
          .sort({ createdAt: -1 })
          .limit(6)
          .select(
            "name description image city state slug denomination isFeatured"
          );

        return NextResponse.json({ success: true, data: recentChurches });
    }
  } catch (error) {
    console.error("Error fetching frontend churches:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
