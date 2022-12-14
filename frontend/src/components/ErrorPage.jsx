import React, { useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { gaException } from '@/utils/misc/analytics';

function ErrorPage() {
  useEffect(() => {
    gaException('Unknown error caused error page to load instead of app.', true);
  }, []);

  return (
    <Box id="error_page" data-testid="error_page" sx={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
      <Box id="error_component" data-testid="error_component" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography id="error_page_label" data-testid="error_page_label">Ooops, something went wrong :(</Typography>
        <Button id="error_page_button" data-testid="error_page_button" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </Box>
    </Box>
  );
}

export default ErrorPage;