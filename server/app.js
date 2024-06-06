if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../.env" });
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const { hikesSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const userRoutes = require("./routes/users");
const hikeRoutes = require("./routes/hikes");
const reviewRoutes = require("./routes/reviews");

// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/hikes";

const MongoDBStore = require("connect-mongo")(session);
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error", err);
  });

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //HTTP forms on web pages only support GET and POST methods. to support PUT, PATCH, and DELETE methods (which are typically used to update and delete resources as per RESTful practices), the methodOverride middleware is used. The string _method passed to methodOverride() is the name of the parameter to look for in the request body. This means you're telling methodOverride to look for a request body field named _method to determine the actual HTTP method to be used. You could use a different name if you preferred, but _method is a common convention.
app.use(express.static(path.join(__dirname, "../client/dist")));

const secret = process.env.SECRET || "thisshouldbeabettersecret!";
const store = new MongoDBStore({
  url: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60, //second
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store: store,
  secret: secret, //only for development environment, in production environ, need to use a random long one
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expres: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7, //milisecond
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user; //all templates can use variable currentUser
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({
    email: "coltttttt@gmail.com",
    username: "coltttttt",
  });
  const newUser = await User.register(user, "chicken");
  res.send(newUser);
});

app.use("/", userRoutes);
app.use("/hikes", hikeRoutes);
app.use("/hikes/:id/reviews", reviewRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  console.error("Global error handler:", err);
  res.status(statusCode).json({ message: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
