import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Profile from "@/models/profile";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  try {
    await dbConnect();
    
    const { bio } = await request.json();

    if (!bio || typeof bio !== 'string') {
      return NextResponse.json(
        { error: "Valid bio is required" },
        { status: 400 }
      );
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { username },
      { bio },
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating bio:", error);
    return NextResponse.json(
      { error: "Failed to update bio" },
      { status: 500 }
    );
  }
}