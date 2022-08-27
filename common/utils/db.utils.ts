import mongoose from "mongoose";

export const getObjectId = (id: string) => new mongoose.Types.ObjectId(id);
