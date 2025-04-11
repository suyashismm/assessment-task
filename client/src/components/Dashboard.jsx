import React, { useState } from 'react';

function Dashboard() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      // Make API request to create blog
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description,
          // Add other required fields as needed by your API
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog');
      }

      // Blog created successfully
      setSuccess(true);
      setDescription(''); // Clear the textarea
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Create a New Blog Post</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>Blog created successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your blog post here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
          cols={50}
          required
        />
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}

export default Dashboard;