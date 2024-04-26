const mongoose = require("mongoose");

const { Schema } = mongoose;

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    category: { type: String },
    tags: [{ type: String }],
    likes: [{ type: mongoose.Types.ObjectId, ref: "User", default: 0 }],
    comments: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
        },
      },
    ],
    image: { type: String },
  },
  { timestamps: true }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
