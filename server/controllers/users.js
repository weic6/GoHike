//server/controllers/users.js
const User = require("../models/user");

module.exports.userRegister = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    console.log("Received registration data:", { email, username, password });
    const user = new User({ email, username });
    console.log("Creating new user:", user);
    const registeredUser = await User.register(user, password);
    console.log("User registered successfully:", registeredUser);

    req.login(registeredUser, (err) => {
      if (err) {
        console.error("Error during login:", err);
        return next(err);
      }
      res.status(201).json({
        message: "User registered successfully",
        user: registeredUser,
      });
    });
  } catch (e) {
    console.error("Error during registration:", e);
    res
      .status(500)
      .json({ message: "Error registering user", error: e.message });
  }
};

module.exports.login = (req, res) => {
  const redirectUrl = res.locals.returnTo || "/hikes";
  res.json({ message: "Login successful", redirectUrl });
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logout successful", redirectUrl: "/hikes" });
  });
};
