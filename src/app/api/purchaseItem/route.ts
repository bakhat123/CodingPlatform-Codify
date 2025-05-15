import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/users";  // User model
import StoreItem from "@/models/store";  // StoreItem model

export async function POST(req: NextRequest) {
  try {
    const { username, itemId, diamonds } = await req.json(); // Get data from the request body

    if (!username || !itemId || !diamonds) {
      return NextResponse.json({ error: "Username, itemId, and diamonds are required" }, { status: 400 });
    }

    await dbConnect(); // Ensure DB is connected

    // Find the user and the item
    const user = await User.findOne({ username });
    const item = await StoreItem.findById(itemId);

    if (!user || !item) {
      return NextResponse.json({ error: "User or item not found" }, { status: 404 });
    }

    // Convert diamonds from string to number
    const userDiamonds = parseFloat(user.diamonds); // Ensure diamonds is treated as an integer
    console.log(userDiamonds);
    // Check if the user has enough diamonds
    if (userDiamonds < diamonds) {
      return NextResponse.json({ error: "Insufficient diamonds" }, { status: 400 });
    }

    // Add the item to the user's assets
    if (item.type === "Background") {
      // Ensure the item is not already purchased (check `backgrounds` array)
      if (!user.assets.backgrounds.includes(item.name)) {
        user.assets.backgrounds.push(item.name); // Add the item name to backgrounds
      } else {
        return NextResponse.json({ error: "Item already purchased" }, { status: 400 });
      }
    } else if (item.type === "Pfp") {
      // Ensure the item is not already purchased (check `pfps` array)
      if (!user.assets.pfps.includes(item.name)) {
        user.assets.pfps.push(item.name); // Add the item name to pfps
      } else {
        return NextResponse.json({ error: "Item already purchased" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Item type is not valid" }, { status: 400 });
    }

    // Deduct the diamonds from the user's balance
    user.diamonds = (userDiamonds - diamonds).toString();  // Update the user's diamonds

    await user.save();  // Save the updated user

    return NextResponse.json({ message: "Item purchased successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during purchase:", error);
    return NextResponse.json({ error: "Failed to purchase item" }, { status: 500 });
  }
}
