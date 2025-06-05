import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      zIndex: 9999
    }}>
      <div style={{
        textAlign: 'center',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h2>Loading Dog Finder...</h2>
        <p>Please wait while we set things up</p>
      </div>
    </div>
  );
};

export default LoadingScreen;