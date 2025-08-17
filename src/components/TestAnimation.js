import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TestAnimation = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <motion.div
        animate={{
          scale: count % 2 === 0 ? 1 : 1.5,
          rotate: count * 90
        }}
        transition={{ duration: 1 }}
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'blue',
          margin: '0 auto'
        }}
      />
      <button onClick={() => setCount(count + 1)}>
        Animate {count}
      </button>
    </div>
  );
};

export default TestAnimation;