import React, { useState } from 'react';
import { Form, Radio, Input, Button, Space } from 'antd';

const { TextArea } = Input;

const LakeNotes = ({ notes, setNotes }) => {
  const [noteInput, setNoteInput] = useState('');
  const [noteType, setNoteType] = useState('simple');
  const [fishBite, setFishBite] = useState({
    point: '',
    nozzle: '',
    bait: '',
    distance: '',
  });

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
    <>
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
    </>
  );
};

export default LakeNotes;
