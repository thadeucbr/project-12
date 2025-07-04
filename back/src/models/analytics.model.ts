import { Schema, model } from 'mongoose';

const analyticsSchema = new Schema({
  date: { type: Date, required: true },
  ip: { type: String, required: true },
  prompt: { type: String },
  enhancementType: { type: String },
});



export const Analytics = model('Analytics', analyticsSchema);
