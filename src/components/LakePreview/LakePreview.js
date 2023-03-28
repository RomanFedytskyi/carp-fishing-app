import React from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import './LakePreview.scss';

const apiKey = 'AIzaSyCPiCIZL4dszBjnNLrvXO2_0eCpZI5DSCM';

const containerStyle = {
  width: '100%',
  height: '200px', // Adjust the height as needed
};

const LakePreview = ({ lake }) => {
  console.log(lake);
  return (
    <div className="lake-preview">
      <LoadScriptNext googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={lake.location}
          zoom={14}
          options={{ disableDefaultUI: true }}
        >
          <Marker position={lake.location} />
        </GoogleMap>
      </LoadScriptNext>
    </div>
  );
};

export default LakePreview;
