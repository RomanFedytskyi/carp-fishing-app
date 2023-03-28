import React, { useState } from 'react';
import LakeList from './components/LakeList/LakeList';
import LakeEditor from './components/LakeEditor/LakeEditor';
import './App.scss';

function App() {
  const [selectedLakeIndex, setSelectedLakeIndex] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <div className="App">
      {!isEditorOpen && (
        <LakeList onLakeSelect={(index) => { setSelectedLakeIndex(index); setIsEditorOpen(true); }} />
      )}
      {isEditorOpen && (
        <LakeEditor
          selectedLakeIndex={selectedLakeIndex}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
