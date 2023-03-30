import React, { useState, useContext, useEffect } from 'react';
import LakeMap from '../LakeMap/LakeMap';
import { LakesContext } from '../../LakesContext';
import LakeStructure from '../LakeStructure/LakeStructure';
import { Button, Form } from 'antd';
import './LakeEditor.scss';
import LakeNotes from '../LakeNotes/LakeNotes';
import LakeDetails from '../LakeDetails/LakeDetails';
import { db } from '../../firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { useAuth } from "../../AuthContext";

const LakeEditor = ({ selectedLakeIndex, onClose }) => {
  const { lakes } = useContext(LakesContext);
  const [name, setName] = useState(selectedLakeIndex !== null ? lakes[selectedLakeIndex].name : '');
  const [description, setDescription] = useState(selectedLakeIndex !== null ? lakes[selectedLakeIndex].description : '');
  const [notes, setNotes] = useState(
    selectedLakeIndex !== null
      ? lakes[selectedLakeIndex].notes.map((note) => {
          if (note.type === 'simple') {
            return {
              type: note.type,
              text: note.text,
              date: note.date,
            };
          } else {
            return {
              type: note.type,
              fishBite: note.fishBite,
              date: note.date,
            };
          }
        })
      : []
  );
  const { currentUser } = useAuth();

  const [location, setLocation] = useState(
    selectedLakeIndex !== null
      ? lakes[selectedLakeIndex].location
      : { lat: 40.730610, lng: -73.935242 }
  );
  const [markerPosition, setMarkerPosition] = useState(
    selectedLakeIndex !== null ? lakes[selectedLakeIndex].location : location
  );
  const rayDataArray =
  selectedLakeIndex !== null
    ? lakes[selectedLakeIndex].rayData.map((rayObj) => {
        return Object.values(rayObj)[0];
      })
    : [];
  const [rayData, setRayData] = useState(
    selectedLakeIndex !== null ? rayDataArray : []
  );
  const [distance, setDistance] = useState(
    selectedLakeIndex !== null ? lakes[selectedLakeIndex].distance : 1
  );
  const [numberOfRays, setNumberOfRays] = useState(
    selectedLakeIndex !== null ? lakes[selectedLakeIndex].numberOfRays : 7
  );
  const [radiusInMeters, setRadiusInMeters] = useState(
    selectedLakeIndex !== null ? lakes[selectedLakeIndex].radiusInMeters : 100
  );

  useEffect(() => {
    if (selectedLakeIndex === null) {
      getCurrentLocation();
    }
  }, []);

  const handleNumberOfRaysChange = (newNumberOfRays) => {
    setNumberOfRays(newNumberOfRays);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMarkerPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async () => {
    const newLake = {
      name,
      description,
      notes: notes,
      location: markerPosition,
      rayData: rayData.map((ray, index) => ({
        [`ray${index + 1}`]: ray,
      })),
      distance,
      numberOfRays,
      radiusInMeters
    };

    if (selectedLakeIndex !== null) {
      const lakeRef = doc(db, "users", currentUser.uid, "userLakes", lakes[selectedLakeIndex].id);
      await setDoc(lakeRef, newLake);
    } else {
      await addDoc(collection(db, "users", currentUser.uid, "userLakes"), newLake);
    }

    onClose();
  };

  return (
    <div className="lake-editor">
      <h2>{selectedLakeIndex !== null ? 'Edit Lake' : 'Add Lake'}</h2>
      <Form layout="vertical">
        <LakeDetails
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
        />
        <LakeMap
          location={location}
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
        />
        <LakeNotes notes={notes} setNotes={setNotes} />
        <LakeStructure
          numberOfRays={numberOfRays}
          updateNumberOfRays={handleNumberOfRaysChange}
          rayData={rayData}
          updateRayData={setRayData}
          initialDistance={distance}
          updateDistance={setDistance}
          radiusInMeters={radiusInMeters}
          updateRadiusInMeters={setRadiusInMeters}
        />
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            {selectedLakeIndex !== null ? 'Save' : 'Add'}
          </Button>
          <Button onClick={onClose} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LakeEditor;
