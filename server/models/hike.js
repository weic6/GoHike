//model/hike.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const HikesSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      //https://mongoosejs.com/docs/geojson.html
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

HikesSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href='/hikes/${this._id}'>${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>
  `;
});

HikesSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
  console.log(doc);
  // console.log("delete it");
});

module.exports = mongoose.model("Hikes", HikesSchema); // creates a model from the defined HikesSchema. The mongoose.model method takes two arguments: the name of the model (in this case, "Hikes"), and the schema to base the model on. the created model is then exported from the file, making it available for import in other files within the Node.js project
