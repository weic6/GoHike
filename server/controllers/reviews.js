//controllers/reviews.js
const Hike = require("../models/hike");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const hike = await Hike.findById(req.params.id);

  const review = new Review(req.body.review);
  review.author = req.user._id;
  hike.reviews.push(review);
  await review.save();
  await hike.save();
  req.flash("success", "Created new review!");
  res.redirect(`/hikes/${hike._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Hike.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //$pull operator will removes from reviews all instances with value reviewId

  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "Successfully deleted the review!");
  res.redirect(`/hikes/${id}`);
};
