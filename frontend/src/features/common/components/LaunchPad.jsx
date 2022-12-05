import React from 'react';
import { Box, Typography } from '@mui/material';
import Button from '@/components/Button';
import OnlineShopping from '@/assets/onlineShopping.png';
import { topBarHeight } from '@/config/config';
import { gaEventHandler } from '@/utils/misc/analytics';
import { useNavigate } from 'react-router-dom';

function LaunchPad() {
  const navigate = useNavigate();
  const gaEventTracker = gaEventHandler('Landing Page');

  const browseCatalogButton = () => {
    gaEventTracker('Catalogue button was clicked', 'Brought user to catalogue page');
    navigate('/catalog');
  };

  return (
    <Box
      id="launch-pad-background"
      data-testid="launch-pad-background"
      sx={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        left: 0,
        right: 0,
        top: 0,
        minHeight: '100%',
        backgroundColor: 'black',
        animation: 'fade-in 1s',
      }}
    >
      <Box
        id="launch-pad-item-container"
        data-testid="launch-pad-item-container"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: ['column', 'row'],
          height: 'fit-content',
          width: '80%',
          mt: `${topBarHeight}em`,
          p: '1em',
          mb: '10em',
        }}
      >
        <Box
          id="launch-pad-text-container"
          data-testid="launch-pad-text-container"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: ['center', 'flex-start'],
            width: ['80%', '30%'],
            height: 'fit-content',
            mb: ['1em', '0em'],
            opacity: 0,
            animation: '1.5s linear 0.5s fade-in forwards',
          }}
        >
          <Typography
            id="launch-pad-text-title"
            data-testid="launch-pad-text-title"
            sx={{ color: 'white', width: 'fit-content' }}
            variant="h2"
          >
            Online Shopping
          </Typography>
          <Typography
            id="launch-pad-text-description"
            data-testid="launch-pad-text-description"
            sx={{
              color: 'white',
              whiteSpace: 'break-spaces',
              maxWidth: '20em',
              width: 'fit-content',
              my: '0.8em'
            }}
            variant="p"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
          <Button
            id="launch-pad-button"
            data-testid="launch-pad-button"
            onClick={browseCatalogButton}
            sx={{
              width: 'fit-content',
              px: '1em',
            }}
          >Browse Catalog</Button>
        </Box>
        <Box
          id="launch-pad-image-container"
          data-testid="launch-pad-image-container"
          sx={{
            width: '60%',
            height: 'fit-content',
            opacity: 0,
            animationFillMode: 'forwards',
            animation: '1.2s ease-in 0.3s fade-in-from-center forwards',
          }}
        >
          <img
            id="launch-pad-image"
            data-testid="launch-pad-image"
            src={OnlineShopping}
            alt="online_shopping.png"
            style={{ height: '100%', width: '100%' }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default LaunchPad;