import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import IconButton from '@/components/IconButton';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import useButtons from '@/stores/topBarButtons';
import { topBarHeight } from '@/config/config';
import { useAuth } from '@/lib/auth';
import { useColorPicker } from '@/stores/colorPickerStore';
import { backgroundColor, componentColor as cColor, buttonBarOpacity, titleBarOpacity, activateColorDrawer } from '@/config/config';
import ProfileMenu from './ProfileMenu';
import { gaEventHandler } from '@/utils/misc/analytics';
import Logo from '@/components/Logo';
import CatalogBar from '@/components/CatalogBar';

function TopBar({ openDropDown }) {
  const gaEventTracker = gaEventHandler('Top Bar');
  const componentColor = cColor;
  const opposingColor = buttonBarOpacity > 0.5 ? componentColor.opposingText.main : backgroundColor.opposingText.main;
  const { buttons } = useButtons();
  const navigate = useNavigate();
  const auth = useAuth();
  const [buttonAmount, setButtonAmount] = useState(0);
  const { open, setOpen, setClose } = useColorPicker();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getButtonAmount = () => {
    let amount = 0;
    if (buttons.profile && auth.user) amount++;
    if (buttons.colorPicker && activateColorDrawer) amount++;
    if (buttons.home) amount++;
    if (buttons.logIn && !auth.user) amount++;
    return amount;
  };

  useEffect(() => {
    setButtonAmount(getButtonAmount());
  }, []);

  const colorPickerButton = () => {
    if (open) {
      gaEventTracker('Color picker drawer button was clicked', 'Color picker drawer was closed');
      setClose();
    } else {
      gaEventTracker('Color picker drawer button was clicked', 'Color picker drawer was opened');
      setOpen();
    }
  };

  const profileButton = () => {
    navigate('/user/profile');
  };

  const settingsButton = () => {
    
  };

  const helpButton = () => {
    
  };

  const homeButton = () => {
    navigate('/');
  };

  const logInButton = () => {
    navigate('/auth/login');
  };

  const logOutButton = () => {
    auth.logout();
    navigate('/');
  };

  const topBarIconSX = {};

  if (buttonAmount > 4) {
    topBarIconSX.width = [`${100 / buttonAmount}%`, 'max-content'];
  }

  return (
    <Box
      id="top-bar"
      data-testid="top-bar"
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: `${topBarHeight}em`,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: `rgba(${componentColor.main})`,
        boxShadow: 'rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px',
      }}
    >
      <Box
        id="top-bar-items-container"
        data-testid="top-bar-items-container"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          id="app-title-container"
          data-testid="app-title-container"
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: titleBarOpacity && `linear-gradient(to right, rgba(${componentColor.main}, ${titleBarOpacity}) 0%, rgba(${componentColor.main}, ${titleBarOpacity}) 75%, rgba(${componentColor.main}, 0) 100%)`,
            pr: ['2em', '5em'],
            width: '25em',
            maxWidth: '50%',
            animation: 'fade-in 1s',
          }}
        >
          <Logo
            id="app-logo"
            data-testid="app-logo"
            onClick={homeButton}
            sx={{
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          />
          <Typography
            id="app-title"
            data-testid="app-title"
            variant='h5'
            component="h1"
            onClick={homeButton}
            sx={{
              mr: '1em',
              textAlign: 'center',
              fontSize: ['1.2em', '1.5em'],
              color: titleBarOpacity >= 0.5 ? `rgba(${opposingColor})` : `rgba(${backgroundColor.opposingText.main})`,
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >Online Store</Typography>
        </Box>
        <Box
          id="top-bar-button-bar-container"
          data-testid="top-bar-button-bar-container"
          sx={{
            width: ['max-content', '100%'],
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fade-in 1s',
          }}
        >
          <Box
            id="top-bar-button-bar"
            data-testid="top-bar-button-bar"
            sx={{
              width: 'max-content',
              pl: ['2em', '5em'],
              pr: ['0em', '2em'],
              display: 'flex',
              justifyContent: 'flex-end',
              animation: 'slide-in-from-right 0.75s',
            }}
          >
            {buttons.home && <IconButton id="home-button" data-testid="home-button" sx={topBarIconSX} description="Home" onClick={homeButton}><HomeIcon sx={{ color: `rgba(${opposingColor})` }} /></IconButton>}
            {(buttons.profile && auth.user) && <IconButton id="profile-button" data-testid="profile-button" aria-controls={menuOpen ? 'profile-menu' : undefined} aria-haspopup="true" aria-expanded={menuOpen ? 'true' : undefined} onClick={handleClick} sx={topBarIconSX} description="Profile"><PersonIcon sx={{ color: `rgba(${opposingColor})` }} /></IconButton>}
            {(buttons.colorPicker && activateColorDrawer) && <IconButton id="colors-button" data-testid="colors-button" sx={topBarIconSX} description="Color scheme" onClick={colorPickerButton}><PaletteIcon sx={{ color: `rgba(${opposingColor})` }} /></IconButton>}
            {(buttons.logIn && !auth.user) && <IconButton id="login-button" data-testid="login-button" sx={topBarIconSX} description="Log-in" onClick={logInButton}><LoginIcon sx={{ color: `rgba(${opposingColor})` }} /></IconButton>}
          </Box>
        </Box>
        {(openDropDown || menuOpen) && (
          <ProfileMenu
            handleClose={handleClose}
            anchorEl={anchorEl}
            menuOpen={openDropDown || menuOpen}
            profileButton={profileButton}
            settingsButton={settingsButton}
            helpButton={helpButton}
            logOutButton={logOutButton}
          />
        )}
      </Box>
      {
        buttons.catalogBar && (
          <CatalogBar />
        )
      }
    </Box>
  );
}

export default TopBar;