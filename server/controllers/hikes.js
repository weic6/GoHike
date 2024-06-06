//controlers/hikes.js
const Hike = require("../models/hike");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_ACCESS_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const hikes = await Hike.find({});
  // res.render("hikes/index", { hikes });
  res.json(hikes);
};

module.exports.renderNewForm = (req, res) => {
  res.render("hikes/new");
};

module.exports.createHike = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.hike.location,
      limit: 1,
    })
    .send();

  const hike = new Hike(req.body.hike);
  hike.geometry = geoData.body.features[0].geometry;
  hike.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  hike.author = req.user._id;
  await hike.save();
  console.log(hike);
  req.flash("success", "successfully made a new hike");
  res.redirect(`/hikes/${hike._id}`);
};

module.exports.showHike = async (req, res) => {
  const hike = await Hike.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    }) //first populates the reviews path of the hike document. Each review in the reviews array is presumed to be a reference to an ObjectId in the reviews collection. After it replaces these ObjectId references with the actual review documents, it further populates the author path of each review document.
    .populate("author"); //a simple populate call on the author path of the hike document
  if (!hike) {
    req.flash("error", "Cannot find that hike!");
    return res.redirect("/hikes");
  }
  res.json(hike);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const hike = await Hike.findById(id);
  if (!hike) {
    req.flash("error", "Cannot find that hike!");
    return res.redirect("/hikes");
  }

  res.json(hike);
};

module.exports.updateHike = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const hike = await Hike.findByIdAndUpdate(id, {
    ...req.body.hike,
  }); //req.body.hike is an array. If want to pass its elements as individual arguments to a function, you can use the spread operator "..."
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  hike.images.push(...imgs);
  await hike.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await hike.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(hike);
  }
  req.flash("success", "Successfully updated the hike.");
  res.redirect(`/hikes/${hike._id}`);
};

module.exports.deleteHike = async (req, res) => {
  const { id } = req.params;
  await Hike.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the hike!");
  res.redirect("/hikes");
};
