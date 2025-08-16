import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <div className="main-layout">
    {/* Shared navigation/header can go here */}
    <Outlet />
    {/* Shared footer can go here */}
  </div>
);

export default MainLayout;
