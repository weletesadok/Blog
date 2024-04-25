const mongoose = require("mongoose");

const { Schema } = mongoose;

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    category: { type: String },
    likes: { type: Number, default: 0 },
    image: {type: String}
  },
  { timestamps: true }
);


blogPostSchema.index({ title: "text", content: "text" });

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
