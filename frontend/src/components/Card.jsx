import React from 'react';
import Box from '@mui/system/Box';
import { commonFormColor, commonFormOpacity } from '@/config/config';
import '@/styles/fade.css';

function Card({ children, sx, type, ...args }) {
  const sxObj = {
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
    // borderRadius: '1em',
    maxWidth: '100vw',
    margin: '1em',
    animation: 'fade-in-from-center 0.5s',
    backgroundColor: `rgba(${commonFormColor.main}, ${commonFormOpacity})`,
    ...sx
  };
  if (type === 2) {
    sxObj.width = [['75%', '90%'], ['max-content', '30em']];
  }
  return (
    <Box
      sx={sxObj}
      {...args}
    >
      {children}
    </Box>
  );
}

export default Card;