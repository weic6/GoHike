//routes/hikes.js
const express = require("express");
const router = express.Router();
const hikes = require("../controllers/hikes");
const catchAsync = require("../utils/catchAsync");
const Hike = require("../models/hike");
const { isLoggedIn, isAuthor, validateHike } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(hikes.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateHike,
    catchAsync(hikes.createHike)
  );

router.get("/new", isLoggedIn, hikes.renderNewForm);

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(hikes.renderEditForm));

router
  .route("/:id")
  .get(catchAsync(hikes.showHike))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateHike,
    catchAsync(hikes.updateHike)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(hikes.deleteHike));
module.exports = router;
