import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; 
import User from "@/models/users";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const username = pathParts[3]; 
    
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const user = await User.findOne({ username }).select('achievements');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.achievements || [], { status: 200 });
    
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" }, 
      { status: 500 }
    );
  }
}