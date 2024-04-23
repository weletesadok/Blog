const authRoutes = require("./authRoutes")
const blogRoutes = require("./blogRoutes")
const userRoutes = require("./userRoutes")

const express = require("express")
const router = express.Router()

// router.use("/user", userRoutes)
// router.use("/blog", blogRoutes)
// router.use("/auth", authRoutes)
console.log("till correct")


module.exports = router