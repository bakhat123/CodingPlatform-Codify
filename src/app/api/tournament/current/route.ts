// src/app/api/tournament/current/route.ts
import { NextResponse } from "next/server";
import { Tournament, Problem } from "@/models"; // Changed import
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    
    // Debug: Log registered model names
    console.log("Registered models:", Object.keys(mongoose.models));

    const currentTournament = await Tournament.findOne({
      status: 'active'
    })
    .populate('problems')
    .lean();

    if (!currentTournament) {
      return NextResponse.json(
        { error: "No active tournament found" },
        { status: 404 }
      );
    }

    return NextResponse.json(currentTournament);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}