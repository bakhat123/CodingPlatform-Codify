import mongoose, { Document, Model, Schema } from "mongoose";
import { IProblem } from "./problem";

export interface ITournament extends Document {
  weekNumber: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  problems: mongoose.Types.ObjectId[] | IProblem[];
  status: 'upcoming' | 'active' | 'completed';
  participants: {
    username: string;
    points: number;
    rewardClaimed?: boolean;  // New field to track reward status
  }[];
}

const TournamentSchema: Schema<ITournament> = new mongoose.Schema({
  weekNumber: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  status: { 
    type: String, 
    enum: ['upcoming', 'active', 'completed'], 
    default: 'upcoming' 
  },
  participants: [{
    username: { type: String, required: true },
    points: { type: Number, default: 0 },
    rewardClaimed: { type: Boolean, default: false }  // Ensure rewards aren't given multiple times
  }]
}, { timestamps: true });

// Indexes
TournamentSchema.index({ status: 1 });
TournamentSchema.index({ 'participants.username': 1 });

const Tournament: Model<ITournament> = 
  mongoose.models.Tournament || 
  mongoose.model<ITournament>("Tournament", TournamentSchema);

export default Tournament;
