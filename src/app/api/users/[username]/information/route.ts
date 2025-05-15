// src/app/api/users/[username]/information/route.ts
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

    const user = await User.findOne({ username }).select('name username email location');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      username: user.username,
      email: user.email,
      location: user.location || "Not specified"
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user information:", error);
    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const username = pathParts[3];

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const body = await req.json();
    const { name, email, location } = body;

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { name, email, location },
      { new: true }
    ).select('name username email location');

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      location: updatedUser.location || "Not specified"
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating user information:", error);
    return NextResponse.json(
      { error: "Failed to update user information" },
      { status: 500 }
    );
  }
}