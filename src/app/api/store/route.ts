// src/app/api/store/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";  // Your MongoDB connection function
import StoreItem from "@/models/store";  // Your StoreItem model

// Handle GET request for fetching store items
export async function GET(_req: NextRequest) {
  try {
    await dbConnect();  // Connect to MongoDB

    const storeItems = await StoreItem.find();  // Fetch all store items

    // Check if data exists
    if (!storeItems || storeItems.length === 0) {
      return NextResponse.json({ error: "No store items found" }, { status: 404 });
    }

    // Return store items as JSON
    return NextResponse.json(storeItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching store items:", error);
    return NextResponse.json({ error: "Failed to fetch store items" }, { status: 500 });
  }
}
