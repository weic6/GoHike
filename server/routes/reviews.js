//routes/reviews.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const Hike = require("../models/hike.js");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");

const { reviewSchema } = require("../schemas.js");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
