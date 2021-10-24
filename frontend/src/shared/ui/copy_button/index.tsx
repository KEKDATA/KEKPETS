import React, { useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';

interface Props {
  textToCopy: string;
  label: string;
  fabColor: 'default' | 'primary';
  sizeButton: 'small' | 'medium';
  sizeIcon: 'small' | 'medium';
}

export const CopyButton = ({
  textToCopy,
  label,
  sizeButton,
  sizeIcon,
  fabColor,
}: Props) => {
  const [showSuccessAlert, setSuccessAlertStatus] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setSuccessAlertStatus(true);
  };

  const handleCloseBar = () => {
    setSuccessAlertStatus(false);
  };

  return (
    <>
      <Tooltip title={label}>
        <Fab
          color={fabColor}
          aria-label={label}
          onClick={handleCopy}
          size={sizeButton}>
          <ContentCopyIcon fontSize={sizeIcon} />
        </Fab>
      </Tooltip>
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={handleCloseBar}>
        <Alert
          onClose={handleCloseBar}
          severity="success"
          sx={{ width: '100%' }}>
          Ссылка скопирована!
        </Alert>
      </Snackbar>
    </>
  );
};
