import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import Event from "@/lib/models/Event";
import { eventSchema } from "@/lib/validations/event";

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
    const user = await User.findById(session.user.id);
    if (!user || !user.church) {
      return NextResponse.json(
        { success: false, message: "User has no church" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = eventSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid event data",
          errors: result.error.errors,
        },
        { status: 400 }
      );
    }

    const event = new Event({
      ...result.data,
      church: user.church,
      slug: "",
    });
    await event.save();

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
