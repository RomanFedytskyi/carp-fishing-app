import React from 'react';
import { Layout, Button } from 'antd';
import { useAuth } from '../../AuthContext';
import { signOut, getAuth } from 'firebase/auth';
import './Header.scss';

const { Header } = Layout;

const AppHeader = () => {
  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Header className="app-header">
      <div className="app-header-content">
        {currentUser && (
          <Button type="primary" onClick={handleSignOut}>
            Sign Out
          </Button>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;
