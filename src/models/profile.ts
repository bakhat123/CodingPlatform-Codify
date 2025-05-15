import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: "No bio yet..."
  },
  followers: {
    type: [String], // Array of follower usernames
    default: []
  },
  following: {
    type: [String], // Array of usernames this user follows
    default: []
  },
  tournamentStats: {
    participated: {
      type: Number,
      default: 0
    },
    top3Finishes: {
      type: Number,
      default: 0
    }
  }
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);