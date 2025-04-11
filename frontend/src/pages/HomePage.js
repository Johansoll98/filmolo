// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import HomeSection from '../components/HomeSection'; 
import InfoBlock from '../components/InfoBlock';

function HomePage() {
  return (
    <>


      {/* Крупная hero-секция, если нужна */}
      <HomeSection
        title="Welcome to Filmolo!"
        content="Find the latest releases, books, hot movies, tv shows and more!!"
      />
      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '40px 0' }}>
        {/* Здесь блоки. Каждый — полноширинный */}
        <Link to="/news" style={{ textDecoration: 'none', color: 'inherit' }}>
        <InfoBlock
          title="Our picks"
          description="Have a look on the newcomers with the original source links!"
          position='left'
        />
        </Link>
        <Link to="/books" style={{ textDecoration: 'none', color: 'inherit' }}>
          <InfoBlock
            title="BOOKS"
            description="Not fancy to rate a film or a tv show? Check out the books!"
            position="right"
          />
        </Link>
        <Link to="/top-actors" style={{ textDecoration: 'none', color: 'inherit' }}>
        <InfoBlock
          title="TOP Actors"
          description="Curious to find out about any actor? Click here and look!"
          position='left'
        />
        </Link>
        <Link to="/coming-soon" style={{ textDecoration: 'none', color: 'inherit' }}>
        <InfoBlock
          title="Latest releases"
          description="See what's in theaters right now!"
          position='right'

        />
        </Link>
      </div>
    </>

  );
}

export default HomePage;
