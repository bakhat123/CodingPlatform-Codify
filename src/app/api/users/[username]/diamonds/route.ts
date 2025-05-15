import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/users"; // Import User model

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);  // Extract the full URL
    const pathParts = url.pathname.split('/'); // Split the path

    const username = pathParts[pathParts.length - 2]; // Extract username dynamically from the path

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    await dbConnect(); // Ensure DB is connected
    const user = await User.findOne({ username }).select("diamonds"); // Get diamonds for the user

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ diamonds: user.diamonds }, { status: 200 });
  } catch (error) {
    console.error("Error fetching diamonds:", error);
    return NextResponse.json({ error: "Failed to fetch diamonds" }, { status: 500 });
  }
}
