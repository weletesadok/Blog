const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};
const getUser = async (req, res) => {
  const user = await User.findOne({ username: req.params.id })
    .select("-password")
    .lean();

  if (!user) {
    return res.status(400).json({ message: "No user found" });
  }

  res.json(user);
};

const createNewUser = async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPwd }
      : { username, password: hashedPwd, roles };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

const updateUser = async (req, res) => {
  const {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    zipCode,
    username,
    password,
    roles,
  } = req.body;
  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      email,
      phoneNumber,
      zipCode,
      username,
      password,
      roles,
    },
    { new: true }
  );

  res.json({ message: `${updatedUser.username} updated` });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
};
const activateUser = async (req, res) => {
  const { userId: id } = req.body;
  console.log(id);

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  if (user.active === true) {
    return res.status(400).json({ message: "User is active" });
  }
  user.active = true;
  const result = await user.save();

  const reply = `Username ${result.username} with ID ${result._id} activated`;

  res.json({ message: reply });
};
const deActivateUser = async (req, res) => {
  const { userId: id } = req.body;
  console.log(id);

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  if (user.active === false) {
    return res.status(400).json({ message: "User is inactive" });
  }
  user.active = false;
  const result = await user.save();

  const reply = `Username ${result.username} with ID ${result._id} deactivated`;

  res.json({ message: reply });
};

module.exports = {
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
  activateUser,
  deActivateUser,
};
