import mongoose from "mongoose";

// Schema for each recommended problem inside an event
const RecommendedProblemSchema = new mongoose.Schema({
  recommendedProblemNumber: {
    type: String,
    required: true,
  },
  usedProblemNumbers: {
    type: [String],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { _id: true });
 
// Schema for the entire recommendation event
const RecommendationSchema = new mongoose.Schema(
  {
    recommendations: {
      type: [RecommendedProblemSchema],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.models.Recommendation ||
  mongoose.model("Recommendation", RecommendationSchema);