import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '300px', // Set the height of the map container
};

const LakeMap = ({ location, markerPosition, setMarkerPosition, google }) => {
  const handleMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  const onMarkerDragEnd = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  return (
    <div className="lake-map">
      <Map
        google={google}
        zoom={13}
        style={containerStyle}
        initialCenter={location}
        center={location}
        onClick={handleMapClick}
      >
        {markerPosition && (
          <Marker
            position={markerPosition}
            draggable={true}
            onDragend={onMarkerDragEnd}
          />
        )}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCPiCIZL4dszBjnNLrvXO2_0eCpZI5DSCM',
})(LakeMap);

