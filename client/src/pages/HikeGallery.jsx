//client/src/pages/Hikes.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";
import Map from "../components/Map";
import "./HikeGallery.css";
function HikeGallery() {
  const [hikes, setHikes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/hikes")
      .then((response) => {
        // console.log("response", response);
        setHikes(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the hikes!", error);
      });
  }, []);

  return (
    <div className="hike">
      <h1>Hike Gallery</h1>
      <Map hikes={{ features: hikes }} />
      <ul>
        {hikes &&
          hikes.map((hike, index) => (
            <Card
              key={index}
              title={hike.title}
              description={hike.description}
              location={hike.location}
              price={hike.price}
              images={hike.images}
            />
          ))}
      </ul>
    </div>
  );
}

export default HikeGallery;
// can you tell me what you add and what is removed ?
