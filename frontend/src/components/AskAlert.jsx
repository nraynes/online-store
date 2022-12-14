import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Typography } from '@mui/material';
import Button from './Button';
import { commonFormColor } from '@/config/config';

const AskAlert = ({ onClose, title, message, allowEnter, element, ...args }) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && allowEnter) {
      onClose(true);
    }
  };

  return (
    <Dialog
      id="alert-dialog"
      data-testid="alert-dialog"
      onKeyDown={(event) => { handleKeyPress(event); }}
      tabIndex="0"
      PaperProps={{
        sx: {
          borderRadius: '0.5em',
          backgroundColor: `rgba(${commonFormColor.main})`,
        },
      }}
      {...args}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" data-testid="alert-dialog-title">
        <Typography variant="h5" sx={{ color: `rgba(${commonFormColor.opposingText.main})` }} component="p">{title}</Typography>
      </DialogTitle>
      <DialogContent id="alert-dialog-description" data-testid="alert-dialog-description">
        <Typography sx={{ color: `rgba(${commonFormColor.opposingText.main})` }} style={{ whiteSpace: 'pre-line' }}>{message}</Typography>
        {element && element}
      </DialogContent>
      <DialogActions
        id="alert-dialog-actions"
        data-testid="alert-dialog-actions"
      >
        <Button id="alert-dialog-no" data-testid="alert-dialog-no" variant='contained' onClick={() => { onClose(false); }}>
          No
        </Button>
        <Button id="alert-dialog-yes" data-testid="alert-dialog-yes" variant='contained' onClick={() => { onClose(true); }}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AskAlert;
