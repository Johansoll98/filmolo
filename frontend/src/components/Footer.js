// Footer.js (example)
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <p>© 2025 Filmolo. Powered by TMBd.</p>
      </div>
      <div className="footer-right">
        <Link to="/terms" className="footer-link">Terms &amp; Conditions</Link>
        <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        <Link to="/faq" className="footer-link">FAQ</Link>
      </div>
    </footer>
  );
}

export default Footer;
