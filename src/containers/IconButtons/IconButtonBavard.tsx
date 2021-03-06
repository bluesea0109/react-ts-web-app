import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import React from 'react';

interface IconButtonBavardProps {
  tooltip: string;
  disabled?: false;
  onClick?(): any;
}

export default function IconButtonBavard(props: IconButtonBavardProps) {
  return (
    <IconButton
      onClick={props.onClick}
      style={{ padding: 6, marginBottom: '20px' }}
      disabled={props.disabled}>
      <Tooltip title={props.tooltip} disableFocusListener={true}>
        <img
          src={'/logo512.png'}
          alt="logo"
          width="60px"
          height="60px"
          style={{ zIndex: 1000000 }}
        />
      </Tooltip>
    </IconButton>
  );
}
