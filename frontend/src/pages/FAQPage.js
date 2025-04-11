// src/pages/FAQPage.js
import React from 'react';

function FAQPage() {
  return (
    <div style={{ padding: '20px', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
      <h2>Frequently Asked Questions (FAQ)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Question 1: How do I register on the site?</strong></p>
        <p>
          Answer: Go to the “Register” page and fill out all required fields. 
          Once you confirm your email, you can enjoy all our features.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Question 2: How can I find a specific movie or TV show?</strong></p>
        <p>
          Answer: Use the search bar at the top of the site to type in the title. 
          You can also browse categories like “Films,” “TV Shows,” “Popular,” or check “News.”
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Question 3: How do I leave a review or rating?</strong></p>
        <p>
          Answer: You need to be logged in. Then, on the detail page of the movie or TV show, 
          you can find a review form and star rating. Click “Submit” or “Rate.”
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Question 4: How do I edit my personal information?</strong></p>
        <p>
          Answer: Go to your profile (the icon on the right side of the header), 
          then click “Edit Profile” and save your changes.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Question 5: What is “Random Picks”?</strong></p>
        <p>
          Answer: It’s a random selection of movies, TV shows, books, or news items 
          for users who are unsure what to search for.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Question 6: How do I contact customer support?</strong></p>
        <p>
          Answer: Please email us at l39149307@student.ua92.ac.uk.
        </p>
      </div>
    </div>
  );
}

export default FAQPage;
