import React from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import './LakePreview.scss';
import { GOOGLE_MAPS_API } from '../../keys';

const containerStyle = {
  width: '100%',
  height: '200px', // Adjust the height as needed
};

const LakePreview = ({ lake }) => {
  return (
    <div className="lake-preview">
      <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API}>
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
