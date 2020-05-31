import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import React from 'react';

interface IIconButtonProps {
  onClick(): any;
  tooltip?: string;
  disabled?: false;
}

export default function IconButtonZoomOut(props: IIconButtonProps) {
  return (
    <IconButton onClick={props.onClick} style={{ padding: 6 }} disabled={props.disabled}>
      <Tooltip title={props.tooltip ?? 'Zoom In'} disableFocusListener={true}>
        <ZoomOutIcon color={props.disabled ? 'disabled' : 'secondary'} />
      </Tooltip>
    </IconButton>
  );
}
