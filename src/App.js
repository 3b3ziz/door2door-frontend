import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import supercluster from "points-cluster";

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/database";

import carImage from "./icon.svg";

var firebaseConfig = {
  // ...
  apiKey: "AIzaSyANZA0N1bvJRofAQGankyvvTn0H8_lgwoQ",
  databaseURL: "https://door2door-f9553.firebaseio.com/"
};

// // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const AnyReactComponent = ({ text, updatedAt, numPoints }) => (
  <div
    title={text}
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "18px",
      height: "18px"
    }}
  >
    {numPoints === 1 ? (
      <img alt="a moving car" src={carImage} />
    ): (
      <div style={{ fontSize: 55 }}>{numPoints}</div>
    )}
  </div>
);

const door2doorOffice = {
  lat: 52.53,
  lng: 13.403
};

const locationsRef = firebase.database().ref("locations/");

function App({ center = door2doorOffice, zoom = 13 }) {
  const [initialVehicles, setInitialVehicles] = useState({});
  const [vehicles, setVehicles] = useState({});
  useEffect(() => {
    locationsRef.on("value", function(snapshot) {
      const vehiclesLocations = snapshot.val();
      if (vehiclesLocations) {
        setInitialVehicles(vehiclesLocations);
        setVehicles(vehiclesLocations);
      }
    });
  }, []);

  const onChange = ({
    bounds, zoom, center, marginBounds, size
  }) => {
    const v = Object.keys(initialVehicles).map(vehicle => {
      const { lat, lng } = initialVehicles[vehicle];
      return {
        lat,
        lng
      };
    });
    const tmp = supercluster(v, {
      minZoom: 3, // min zoom to generate clusters on
      maxZoom: 15, // max zoom level to cluster the points on
      radius: 60 // cluster radius in pixels
    });
    const tst = tmp({
      bounds,
      center,
      zoom
    });
    const clusteredVehicles = tst.map(({ wx, wy, numPoints, points }) => ({
      lat: wy,
      lng: wx,
      text: numPoints,
      numPoints,
    }))
    setVehicles(clusteredVehicles);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDWukuXz2CdPeJh2GmUERJqw5z-qQu0It4" }}
        defaultCenter={center}
        defaultZoom={zoom}
        onChange={onChange}
      >
        {Object.keys(vehicles).map(vehicle => {
          const { lat, lng, at, numPoints = 1 } = vehicles[vehicle];
          return (
            <AnyReactComponent
              lat={lat}
              lng={lng}
              text={vehicle}
              updatedAt={at}
              numPoints={numPoints}
            />
          );
        })}
      </GoogleMapReact>
    </div>
  );
}

export default App;
