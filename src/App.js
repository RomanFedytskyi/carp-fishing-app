import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import LakeList from "./components/LakeList/LakeList";
import LakeEditor from "./components/LakeEditor/LakeEditor";
import { Layout } from 'antd';
import AppHeader from './components/Header/Header';
import { LakesProvider } from "./LakesContext";

import "./App.scss";

function App() {
  return (
    <AuthProvider>
      <LakesProvider>
        <Router>
          <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/*" element={<PrivateWrapper />} />
          </Routes>
        </Router>
      </LakesProvider>
    </AuthProvider>
  );
}

const PrivateWrapper = () => {
  const { currentUser } = useAuth();

  return currentUser ? <ProtectedApp /> : <SignIn />;
};

const ProtectedApp = () => {
  const [selectedLakeIndex, setSelectedLakeIndex] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <Layout className="App">
      <AppHeader />
      <Layout.Content>
        {!isEditorOpen && (
          <LakeList
            onLakeSelect={(index) => {
              setSelectedLakeIndex(index);
              setIsEditorOpen(true);
            }}
          />
        )}
        {isEditorOpen && (
          <LakeEditor
            selectedLakeIndex={selectedLakeIndex}
            onClose={() => setIsEditorOpen(false)}
          />
        )}
      </Layout.Content>
    </Layout>
  );
};

export default App;
