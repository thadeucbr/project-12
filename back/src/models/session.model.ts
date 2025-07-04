import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const SessionSchema: Schema = new Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 0 }, // 'expires' will be set dynamically
  expiresAt: { type: Date, required: true },
});

// Index for efficient lookup and TTL (Time-To-Live) for automatic deletion
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ISession>('Session', SessionSchema);
