// src/models/users.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// src/models/users.ts
interface IUser extends Document {
  _id: string; 
  name: string;
  email: string;
  password?: string;
  username: string;
  diamonds: string;
  pfp: string;
  background: string;
  location?: string;  // Add this line
  achievements: string[];
  assets: {
    pfps: string[];
    backgrounds: string[];
  };
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    username: { type: String, required: true, unique: true, index: true },
    diamonds: { type: String, default: "50" },
    pfp: { type: String, required: false, default: "hi" },
    background: { type: String, required: false, default: "" },
    location: { type: String, required: false },  // Add this line
    achievements: { type: [String], default: [] },
    assets: {
      pfps: { type: [String], default: [] },
      backgrounds: { type: [String], default: [] }
    }
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
