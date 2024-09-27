import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <LinearProgress
          sx={{
            backgroundColor: '#e0e0e0', // Track color
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(to right, #d35da2, #6B83D3)', // Gradient color
            },
          }}
        />
        <p>Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loader;


