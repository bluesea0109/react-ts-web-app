import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import React from 'react';

interface IIconButtonProps {
  onClick(): any;
  tooltip?: string;
  disabled?: false;
}

export default function IconButtonZoomIn(props: IIconButtonProps) {
  return (
    <IconButton onClick={props.onClick} style={{ padding: 6 }} disabled={props.disabled}>
      <Tooltip title={props.tooltip ?? 'Zoom In'} disableFocusListener={true}>
        <ZoomInIcon color={props.disabled ? 'disabled' : 'secondary'} />
      </Tooltip>
    </IconButton>
  );
}
