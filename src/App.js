import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
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
            <Route path="/lakes" element={<PrivateWrapper />} />
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
  return (
    <Layout className="App">
      <AppHeader />
      <Layout.Content>
        <Routes>
          <Route path="/" element={<LakeList />} />
          <Route path="/lakes" element={<LakeList />} />
          <Route path="/lakes/:lakeId" element={<LakeEditor />} />
          <Route path="*" element={<Outlet />} />
        </Routes>
      </Layout.Content>
    </Layout>
  );
};

export default App;
