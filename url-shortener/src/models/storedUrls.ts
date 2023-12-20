import mongoose, { Schema, Document } from "mongoose";

const StoredUrlSchema = new mongoose.Schema({
    key: { type: String, required: true },
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
});

export type StoredUrl = mongoose.InferSchemaType<typeof StoredUrlSchema>;
export const StoredUrl = mongoose.model("StoredUrl", StoredUrlSchema);
