import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

const Admin = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <div>
      {loggedIn ? <Dashboard /> : <Login onLogin={handleLogin} />}
    </div>
  );
};

export default Admin;
