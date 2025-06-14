import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth.config";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Log file details for debugging
    console.log("File details:", {
      type: file.type,
      size: file.size,
      name: file.name,
    });

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Log Cloudinary config for debugging
    console.log("Cloudinary config:", {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "exists" : "missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "exists" : "missing",
    });

    try {
      // Upload to Cloudinary with specific folder structure
      const result = await cloudinary.uploader.upload(base64String, {
        folder: "Church_finder/Churches",
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto",
        flags: "attachment",
        transformation: [
          { width: 800, height: 800, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      return NextResponse.json({
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      });
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          message: "Error uploading to Cloudinary",
          error:
            uploadError instanceof Error
              ? uploadError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
