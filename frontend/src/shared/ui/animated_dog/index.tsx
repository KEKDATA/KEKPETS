import React from 'react';

import './styles.css';

export const AnimatedDog = () => {
  return (
    <div className="dog">
      <div className="ears" />

      <div className="body">
        <div className="eyes" />
        <div className="beard">
          <div className="mouth">
            <div className="tongue" />
          </div>
        </div>
        <div className="belt">
          <div className="locket" />
          <div className="dot dot1" />
          <div className="dot dot2" />
          <div className="dot dot3" />
          <div className="dot dot4" />
          <div className="tag" />
        </div>
        <div className="stomach" />
        <div className="legs">
          <div className="left" />
          <div className="right" />
        </div>
      </div>
      <div className="tail" />
    </div>
  );
};
