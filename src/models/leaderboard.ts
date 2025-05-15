import mongoose, { Document, Model, Schema } from "mongoose";

// Define the Leaderboard interface
export interface ILeaderboard extends Document {
  userId: mongoose.Schema.Types.ObjectId;  // Reference to User
  points: number;
}

// Define the Leaderboard Schema
const LeaderboardSchema: Schema<ILeaderboard> = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true },
  },
  { timestamps: true }
);

// Define and export the Leaderboard model
const Leaderboard: Model<ILeaderboard> = mongoose.models.Leaderboard || mongoose.model<ILeaderboard>("Leaderboard", LeaderboardSchema);

export default Leaderboard;
