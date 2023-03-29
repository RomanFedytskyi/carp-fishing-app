import React, { useState, useContext, useEffect } from 'react';
import LakeMap from '../LakeMap/LakeMap';
import { LakesContext } from '../../LakesContext';
import LakeStructure from '../LakeStructure/LakeStructure';
import { Input, Button, Form, Radio, Space } from 'antd';
import './LakeEditor.scss';

const { TextArea } = Input;

const LakeEditor = ({ selectedLakeIndex, onClose }) => {
  const { lakes, setLakes } = useContext(LakesContext);
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
  const [noteInput, setNoteInput] = useState('');
  const [noteType, setNoteType] = useState('simple');
  const [fishBite, setFishBite] = useState({
    point: '',
    nozzle: '',
    bait: '',
    distance: '',
  });
  const [location, setLocation] = useState(
    selectedLakeIndex !== null
      ? lakes[selectedLakeIndex].location
      : { lat: 40.730610, lng: -73.935242 }
  );
  const [markerPosition, setMarkerPosition] = useState(
    selectedLakeIndex !== null ? lakes[selectedLakeIndex].location : location
  );

  useEffect(() => {
    if (selectedLakeIndex === null) {
      getCurrentLocation();
    }
  }, []);

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

  const handleSubmit = () => {
    const newLake = {
      name,
      description,
      notes: notes,
      location: markerPosition,
    };

    if (selectedLakeIndex !== null) {
      setLakes([...lakes.slice(0, selectedLakeIndex), newLake, ...lakes.slice(selectedLakeIndex + 1)]);
    } else {
      setLakes([...lakes, newLake]);
    }

    onClose();
  };

  const addNote = () => {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Add hours and minutes
    let newNote;
  
    if (noteType === 'simple') {
      if (!noteInput.trim()) return; // Prevent adding empty simple notes
      newNote = {
        type: 'simple',
        text: noteInput,
        date,
      };
    } else if (noteType === 'fishBite') {
      // Check that all fishBite properties are defined before adding the new note
      if (!fishBite.point || !fishBite.nozzle || !fishBite.bait || !fishBite.distance) return; // Prevent adding empty fish bite notes
      newNote = {
        type: 'fishBite',
        fishBite,
        date,
      };
    }
  
    setNotes([...notes, newNote]);
    setNoteInput('');
    setFishBite({
      point: '',
      nozzle: '',
      bait: '',
      distance: '',
    });
  };
  

  return (
    <div className="lake-editor">
      <h2>{selectedLakeIndex !== null ? 'Edit Lake' : 'Add Lake'}</h2>
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Description">
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>
        <LakeMap
          location={location}
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
        />
        <Form.Item label="Note Type">
          <Radio.Group value={noteType} onChange={(e) => setNoteType(e.target.value)}>
            <Radio value="simple">Simple Note</Radio>
            <Radio value="fishBite">Fish Bite</Radio>
          </Radio.Group>
        </Form.Item>
        {noteType === 'simple' && (
          <Form.Item label="Notes">
            <TextArea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} rows={3} />
          </Form.Item>
        )}
        {noteType === 'fishBite' && (
          <Space direction="vertical" className="fish-bait-input">
            <Form.Item label="Point" className="fish-bait-input">
              <Input value={fishBite.point} onChange={(e) => setFishBite({ ...fishBite, point: e.target.value })} />
            </Form.Item>
            <Form.Item label="Nozzle" className="fish-bait-input">
              <Input value={fishBite.nozzle} onChange={(e) => setFishBite({ ...fishBite, nozzle: e.target.value })} />
              </Form.Item>
            <Form.Item label="Bait" className="fish-bait-input">
              <Input value={fishBite.bait} onChange={(e) => setFishBite({ ...fishBite, bait: e.target.value })} />
            </Form.Item>
            <Form.Item label="Distance (meters)" className="fish-bait-input">
              <Input
                type="number"
                value={fishBite.distance}
                onChange={(e) =>
                  setFishBite({ ...fishBite, distance: e.target.value })
                }
                min={0}
                step={0.1}
              />
            </Form.Item>
          </Space>
        )}
        <Form.Item>
          <Button type="primary" onClick={addNote} style={{ marginTop: 10 }}>
            Add Note
          </Button>
        </Form.Item>
        {notes.map((note, index) => (
            <div
              key={index}
              className={`note${note.type === 'fishBite' ? ' fish-bite-note' : ''}`}
            >
            <div>
              <strong>Date:</strong> {note.date}
            </div>
            {note.type === 'simple' ? (
              <div>
                <strong>Text:</strong> {note.text}
              </div>
            ) : (
              <>
                <div>
                  <strong>Fish Bite</strong>
                </div>
                <div>
                  <strong>Point:</strong> {note.fishBite.point}
                </div>
                <div>
                  <strong>Nozzle:</strong> {note.fishBite.nozzle}
                </div>
                <div>
                  <strong>Bait:</strong> {note.fishBite.bait}
                </div>
                <div>
                  <strong>Distance:</strong> {note.fishBite.distance} meters
                </div>
              </>
            )}
          </div>
        ))}
        <LakeStructure numberOfRays={7} />
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
