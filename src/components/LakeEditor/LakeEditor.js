import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const LakeEditor = ({ onClose }) => {
  const navigate = useNavigate();
  const { lakes } = useContext(LakesContext);
  const { currentUser } = useAuth();
  const { lakeId } = useParams();
  const selectedLake = lakes.find((lake) => lake.id === lakeId); // Find the lake by lakeId
  const isNewLake = !selectedLake;

  const [name, setName] = useState(!isNewLake ? selectedLake.name : '');
  const [description, setDescription] = useState(!isNewLake ? selectedLake.description : '');
  const [notes, setNotes] = useState(
    !isNewLake
      ? selectedLake.notes.map((note) => {
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

  const [location, setLocation] = useState(
    !isNewLake
      ? selectedLake.location
      : { lat: 40.730610, lng: -73.935242 }
  );
  const [markerPosition, setMarkerPosition] = useState(
    !isNewLake ? selectedLake.location : location
  );
  const rayDataArray =
    !isNewLake
      ? selectedLake.rayData.map((rayObj) => {
          return Object.values(rayObj)[0];
        })
      : [];
  const [rayData, setRayData] = useState(
    !isNewLake ? rayDataArray : []
  );
  const [distance, setDistance] = useState(
    !isNewLake ? selectedLake.distance : 1
  );
  const [numberOfRays, setNumberOfRays] = useState(
    !isNewLake ? selectedLake.numberOfRays : 7
  );
  const [radiusInMeters, setRadiusInMeters] = useState(
    !isNewLake ? selectedLake.radiusInMeters : 100
  );

  useEffect(() => {
    if (isNewLake) {
      getCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (!isNewLake) {
      const lakeRef = doc(db, "users", currentUser.uid, "userLakes", selectedLake.id);
      await setDoc(lakeRef, newLake);
    } else {
      await addDoc(collection(db, "users", currentUser.uid, "userLakes"), newLake);
    }

    navigate('/lakes');
  };

  return (
    <div className="lake-editor">
      <h2>{!isNewLake ? 'Edit Lake' : 'Add Lake'}</h2>
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
            {!isNewLake ? 'Save' : 'Add'}
          </Button>
          <Button onClick={() => navigate('/lakes')} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LakeEditor;
