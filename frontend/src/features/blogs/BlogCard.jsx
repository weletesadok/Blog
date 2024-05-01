import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Image from "./../../img/image.jpeg";
import { Link } from "react-router-dom";

export default function MultiActionAreaCard(blog) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <Link to={`/blogs/${blog.blog._id}`}>
          <CardMedia
            component="img"
            height="140"
            image={blog.blog.image ? blog.blog.image : Image}
            alt="green iguana"
          />
        </Link>
        <CardContent>
          <Typography>{blog.blog.title}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
