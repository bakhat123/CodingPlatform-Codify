// src/models/store.ts
import mongoose, { Document, Model, Schema } from "mongoose";

interface IStoreItem extends Document {
  name: string;
  type: string;
  features: string[];
  price: string;
}

const StoreItemSchema: Schema<IStoreItem> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    features: { type: [String], required: true },
    price: { type: String, required: true },
  },
  { timestamps: true, collection: 'store' }  // Explicitly set the collection name
);

const StoreItem: Model<IStoreItem> =
  mongoose.models.StoreItem || mongoose.model<IStoreItem>("StoreItem", StoreItemSchema);

export default StoreItem;
