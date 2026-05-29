import React from 'react';
import { useTransition, animated } from 'react-spring';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  
  const transitions = useTransition(location, {
    from: { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
    enter: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
    leave: { opacity: 0, transform: 'translate3d(0, -10px, 0)', position: 'absolute', width: '100%', top: 0 },
    config: {
      tension: 300,
      friction: 30,
    },
  });

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {transitions((style, item) => (
        <animated.div style={style}>
          <div key={item.pathname}>
            {children}
          </div>
        </animated.div>
      ))}
    </div>
  );
};

export default PageTransition;
