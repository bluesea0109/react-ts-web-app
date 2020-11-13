import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PlayIcon from '@material-ui/icons/PlayArrow';
import React from 'react';

interface IconButtonPlayProps {
  onClick(): any;
  tooltip: string;
  disabled?: false;
}

export default function IconButtonPlay(props: IconButtonPlayProps) {
  return (
    <IconButton
      onClick={props.onClick}
      style={{ padding: 6 }}
      disabled={props.disabled}>
      <Tooltip title={props.tooltip} disableFocusListener={true}>
        <PlayIcon color={props.disabled ? 'disabled' : 'secondary'} />
      </Tooltip>
    </IconButton>
  );
}
