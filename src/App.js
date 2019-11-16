import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/database";

var firebaseConfig = {
  // ...
  apiKey: "AIzaSyANZA0N1bvJRofAQGankyvvTn0H8_lgwoQ",
  databaseURL: "https://door2door-f9553.firebaseio.com/"
};

// // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const AnyReactComponent = ({ text, updatedAt }) => (
  <div
    title={updatedAt}
    style={{
      color: "white",
      background: "grey",
      padding: "15px 10px",
      display: "inline-flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "100%",
      transform: "translate(-50%, -50%)"
    }}
  >
    {text}
  </div>
);

const door2doorOffice = {
  lat: 52.53,
  lng: 13.403
};

const locationsRef = firebase.database().ref("locations/");

function App({ center = door2doorOffice, zoom = 16 }) {
  const [vehicles, setVehicles] = useState({});
  useEffect(() => {
    locationsRef.on("value", function(snapshot) {
      const vehiclesLocations = snapshot.val();
      setVehicles(vehiclesLocations);
    });
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDWukuXz2CdPeJh2GmUERJqw5z-qQu0It4" }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {Object.keys(vehicles).map(vehicle => {
          const { lat, lng, at } = vehicles[vehicle];
          return (
            <AnyReactComponent
              lat={lat}
              lng={lng}
              text={vehicle}
              updatedAt={at}
            />
          );
        })}
      </GoogleMapReact>
    </div>
  );
}

export default App;
