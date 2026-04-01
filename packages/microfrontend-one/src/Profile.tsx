import React from 'react';
import { PageTitle } from 'ui';
import { Link } from 'react-router-dom';

function Profile() {
  return (
    <div className="text-center mt-12">
      <PageTitle>Profile Page</PageTitle>
      <p className="mb-8 text-gray-600 dark:text-gray-400">This is the profile page from microfrontend-one.</p>
      
      <div className="mt-8">
        <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}

export default Profile;
