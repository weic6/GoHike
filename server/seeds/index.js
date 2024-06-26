const mongoose = require("mongoose");
const Hike = require("../models/hike");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose.connect("mongodb://localhost:27017/hikes", {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Hike.deleteMany({}); //delete everything in db
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const hike = new Hike({
      author: "65f1825afe174d47a0660fe5",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto, molestiaea eos tempore eaque dolore quo in iusto odit assumenda saepe voluptas dictalaborum ex doloremque harum dolorum hic inventore.",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dkaew6fxx/image/upload/v1710394660/Hikes/wt5g8nv2zulmit20sigm.jpg",
          filename: "Hikes/wt5g8nv2zulmit20sigm",
        },
        {
          url: "https://res.cloudinary.com/dkaew6fxx/image/upload/v1710394660/Hikes/v47bvx2ctfmwklywoz9y.jpg",
          filename: "Hikes/v47bvx2ctfmwklywoz9y",
        },
      ],
    });
    await hike.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
}); //seedDB returns a promise because it is an aysnc func
