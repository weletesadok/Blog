const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const crypto = require('crypto')

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      zipCode,
      username,
      password,
      roles,
    } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    let avatarUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      avatarUrl = result.secure_url;
    }
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      zipCode,
      username,
      password: hashedPwd,
      roles,
      avatar: avatarUrl,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

const resetPassword = async (req, res) => {
  try {
    const { password, newPassword, email } = req.body;

    if (!email) {
      return res.status(401).send("email required");
    }

    if (!password || !newPassword) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "user not found." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Please enter your correct old password." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    existingUser.password = hash;
    existingUser.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password.",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
const forgot = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .send({ error: "No user found for this email address." });
    }

    const buffer = crypto.randomBytes(48);
    const resetToken = buffer.toString("hex");
    console.log(resetToken)

    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpires = Date.now() + 3600000;

    existingUser.save();

    //logic  send reset token to user with email

    res.status(200).json({
      success: true,
      message: "Please check your email for the link to reset your password.",
    });
  } catch (error) {
    res.status(400).json({
      message: "Your request could not be processed. Please try again.",
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const resetUser = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!resetUser) {
      return res.status(400).json({
        error:
          "Your token has expired. Please attempt to reset your password again.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    resetUser.password = hash;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordExpires = undefined;

    resetUser.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password.",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
const profile = async (req, res) => {
  try {
    const userId = req.params.id;
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(400).json({ message: "user not found" });
    }
    res.json(foundUser);
  } catch (e) {
    res
      .status(500)
      .json({ message: "sorry you request could not be processed" });
  }
};
const updateProfile = async (req, res) => {
  try {
    console.log(req.body);
    const { user } = req.body;
    const foundUser = await User.findById(user._id);
    if (!foundUser) {
      return res.status(400).json({ message: "user not found" });
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, user, {
      new: true,
    });
    res.json({ updatedUser, message: "user updated successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "sorry you request could not be processed" });
  }
};
const googleAuth = (req, res) => {
  // logic to reset password
};

module.exports = {
  login,
  refresh,
  logout,
  registerUser,
  forgotPassword,
  resetPassword,
  googleAuth,
  forgot,
  profile,
  updateProfile,
};
