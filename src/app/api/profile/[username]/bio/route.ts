import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Profile from "@/models/profile";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { username: string } } // Properly typed params
) {
  try {
    await dbConnect();
    
    // Safe parameter access - don't destructure directly
    const username = params.username;
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