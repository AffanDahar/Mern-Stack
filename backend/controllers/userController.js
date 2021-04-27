const HttpError = require("../models/http-error");
const User = require("../models/userModel");
const genrateTokens = require("../utils/authUtils");

const signUp = async (req, res, next) => {
  const { name, email, password, } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new HttpError("User already exists", 422);
    return next(error);
  }

  const createUser = new User({
    name,
    email,
    password,
    places: [],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
  });

  let user;
  try {
    user = await createUser.save();
  } catch (err) {
    return next(err);
  }

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genrateTokens(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

const login = async (req, res ,next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    const error = new HttpError("invalid email or password", 400);
    return next(error)
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: genrateTokens(user._id),
  });
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

module.exports = { signUp, login , getUsers};
