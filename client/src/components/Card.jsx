import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Card.css";
// const Card = ({ id, index, title, description, location, price, images }) => {
const Card = (props) => {
  return (
    <div className="card" id={props._id}>
      <div className="card-img">
        {props.images.length && (
          <img src={props.images[0].url} alt={props.title} width={200} />
        )}
      </div>
      <div className="card-text">
        <h2>{props.title}</h2>
        <p>{props.description}</p>
        <p>{props.location}</p>
        <p>{props.price}</p>
        <Link to={`http://localhost:3000/hikes/${props._id}`}>
          <button>View {props.title}</button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
