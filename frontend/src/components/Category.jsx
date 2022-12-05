import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

function Category({ category = '', last = false, first = false, sx = {}, ...args }) {
  const [isVisible, setVisible] = useState(true);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    });
    observer.observe(domRef.current);
    return () => observer.unobserve(domRef.current);
  }, []);

  const sxObj = {};
  const border = 'solid black 1px';
  if (!last) {
    sxObj.borderRight = border;
  }
  if (!first) {
    sxObj.borderLeft = border;
  }

  return (
    <Box
      className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
      ref={domRef}
      sx={{
        transition: '0.5s',
        px: '1em',
        '&:hover': {
          cursor: 'pointer',
          px: '5em',
        },
        ...sx,
        ...sxObj
      }}
      {...args}
    >
      <Typography
        variant="h6"
      >{category}</Typography>
    </Box>
  );
}

export default Category;