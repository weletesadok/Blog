const express = require("express");
const router = express.Router();
const User = require("./../models/User")
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// (async ()=>{
//   User.deleteMany({})
// })()

router.get("/", async (req, res)=>{
  try {
    const allUsers = await User.find({})
    if(!allUsers) return res.status(404).json({message: "no user found in the database"})
    res.status(200).json({ allUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.post("/add", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.user || req.user.roles.indexOf("Admin") === -1) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
      roles,
      active,
    } = req.body;

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
      roles: roles || ["User"],
      active: active || true,
      avatar: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newUser.save();

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put(
  "/:userId",
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.user || req.user.roles.indexOf("Admin") === -1) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const userId = req.params.userId;
      const {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        password,
        roles,
        active,
      } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          username,
          email,
          phoneNumber,
          password,
          roles: roles || ["User"],
          active: active || true,
          avatar: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put("/activate/:userId", async (req, res) => {
  try {
    if (!req.user || req.user.roles.indexOf("Admin") === -1) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const userId = req.params.userId;

    const activatedUser = await User.findByIdAndUpdate(
      userId,
      { active: true },
      { new: true }
    );

    if (!activatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User activated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/deactivate/:userId", async (req, res) => {
  try {
    if (!req.user || req.user.roles.indexOf("Admin") === -1) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const userId = req.params.userId;

    const deactivatedUser = await User.findByIdAndUpdate(
      userId,
      { active: false },
      { new: true }
    );

    if (!deactivatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
