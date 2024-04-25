const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (!allUsers)
      return res.status(404).json({ message: "no user found in the database" });
    res.status(200).json({ allUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).exec();
    if (!user)
      return res.status(404).json({ message: "user not found with this id" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "internal server error", e });
  }
});
router.post("/", upload.single("avatar"), async (req, res) => {
  try {
    const { firstName, lastName, username, email, phoneNumber, password } =
      req.body;

    const foundUser = await User.findOne({
      $or: [{ username }, { email }],
    }).exec();
    if (foundUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      avatar: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    const registeredUser = await newUser.save();
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: registeredUser.username,
          roles: registeredUser.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { username: registeredUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", token: accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
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
        // avatar: {
        //   data: req.file.buffer,
        //   contentType: req.file.mimetype,
        // },
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
});

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
router.delete("/:id", (req, res))

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
