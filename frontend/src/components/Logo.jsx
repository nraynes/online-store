import React from 'react';
import { Box } from '@mui/material';
import logo from '@/assets/logo512.png';

function Logo({ sx, ...args }) {
  return (
    <Box
      sx={{
        height: '2em',
        width: 'max-content',
        m: '1em',
        ...sx,
      }}
      {...args}
    >
      <img src={logo} alt="logo" style={{ width: '100%', height: '100%' }} />
    </Box>
  );
}

export default Logo;