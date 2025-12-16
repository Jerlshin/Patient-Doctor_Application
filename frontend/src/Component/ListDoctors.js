import React from 'react';
import { Link } from 'react-router-dom';

export function ListDoctors(props) {
  const containerStyle = {
    width: '18rem',
    transition: 'transform 0.3s ease', /* Add a smooth transition */
  };

  const cardBodyStyle = {
    height: '180px',
    transition: 'transform 0.3s ease', /* Add the same transition */
  };

  const imageStyle = {
    height: '180px', /* Set a fixed height for the image */
    width: 'auto', /* Let the width adjust automatically */
    transition: 'transform 0.3s ease', /* Add the same transition */
  };

  return (
    <div className="col py-5" style={containerStyle}>
      <div className="card" style={containerStyle}>
        <div className="container" style={containerStyle}> {/* Container for image and card body */}
          <img src={props.obj.image} className="card-img-top" style={imageStyle} alt="" />
          <div className="card-body text-center" style={cardBodyStyle}>
            <h5 className="card-title">{props.obj.name}</h5>
            <p className="card-text">{props.obj.profession}</p>
            <p className="card-text">{props.obj.qualification}</p>
            <p className="card-text">{props.obj.address + ", "} {props.obj.city}</p>
            <Link to={`/message/${props.obj._id}`} className="btn btn-primary">Message</Link>
          </div>
        </div>
      </div>
      {/* Apply hover styles using CSS */}
      <style>
        {`
          .card:hover {
            transform: scale(1.1); /* Increase the scale to make it bigger */
            cursor: pointer; /* Change cursor to indicate interactivity */
            z-index: 1; /* Ensure the hovered card is on top of other cards */
          }
          
          .card:hover .container {
            transform: scale(1.1); /* Increase the scale of the container */
          }
        `}
      </style>
    </div>
  );
}
