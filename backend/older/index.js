require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const path = require('path')
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const verifyJWT = require("./middleware/verifyJWT");

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());


app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/blogs", require("./routes/blogRoutes"));


app.get('/', (req, res) => {
  res.status(200)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', 'index.html'))
  } else if (req.accepts('json')) {
      res.json({ message: 'this is blog api by ayele masresha https://www.github.com/weletesadok' })
  } else {
      res.type('txt').send('this is blog api by ayele masresha https://www.github.com/weletesadok')
  }
})


app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})



app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
