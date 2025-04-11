// HomeSection.js
import React from 'react';
import './HomeSection.css';

function HomeSection({ title, content }) {
  return (
    <section className="home-section">
      <h2 className="section-title">{title}</h2>
      <p className="section-content">{content}</p>
    </section>
  );
}

export default HomeSection;
