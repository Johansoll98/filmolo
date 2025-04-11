import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import CustomScrollRestoration from './CustomScrollRestoration';
import './Layout.css';

function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <CustomScrollRestoration />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
