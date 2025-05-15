// src/app/api/users/[username]/assets/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/users";  // User model

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const username = pathParts[3];  // Extract username from the URL

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    await dbConnect(); // Ensure DB is connected
    const user = await User.findOne({ username }).select("assets"); // Fetch user and their assets

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ assets: user.assets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
  }
}
