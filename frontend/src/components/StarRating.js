// components/StarRating.js
import React, { useState } from 'react';

function StarRating({ maxRating = 10, currentRating = 0, onRatingSelect }) {
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleMouseOver = (index) => setHoveredStar(index);
  const handleMouseOut = () => setHoveredStar(0);
  const handleClick = (index) => onRatingSelect(index);

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {Array.from({ length: maxRating }, (_, i) => {
        const index = i + 1;
        // Если звезда либо до текущего рейтинга, либо до звезды, на которую навели, то она закрашена
        const fill = index <= (hoveredStar || currentRating) ? '#FFD700' : '#ccc';
        return (
          <svg
            key={index}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={fill}
            onMouseOver={() => handleMouseOver(index)}
            onMouseOut={handleMouseOut}
            onClick={() => handleClick(index)}
            style={{ cursor: 'pointer' }}
          >
            <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.788 1.402 8.168L12 18.896l-7.336 3.871 
                     1.402-8.168L.132 9.211l8.2-1.193L12 .587z" />
          </svg>
        );
      })}
    </div>
  );
}

export default StarRating;
