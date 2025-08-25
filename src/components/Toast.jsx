import React, { useState, useEffect } from 'react';

const Toast = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 1500); // CSS transition is .3s, so remove after it's faded out
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className={`toast ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default Toast;
