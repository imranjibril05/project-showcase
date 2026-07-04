const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
  type: String,
  enum: ["all", "Website", "Design", "Art", "AI", "Creative"]
},
  technologies: { type: [String], required: true },

  images:  [String],

  link: {
          type: String,
          default: ""
        },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  comments: [CommentSchema]

}, { timestamps: true });

ProjectSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Project", ProjectSchema);