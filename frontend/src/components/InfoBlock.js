// InfoBlock.js
import React from 'react';
import './InfoBlock.css';

function InfoBlock({ title, description, position = 'left' }) {
  // Формируем класс: "info-block left" или "info-block right"
  const classes = `info-block ${position}`;

  return (
    <div className={classes}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default InfoBlock;
