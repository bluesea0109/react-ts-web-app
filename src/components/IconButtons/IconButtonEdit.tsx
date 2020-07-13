import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';

interface IconButtonEditProps {
  onClick(): any;
  tooltip: string;
  disabled?: boolean;
}

export default function IconButtonEdit(props: IconButtonEditProps) {
  return (
    <IconButton onClick={props.onClick} style={{ padding: 6 }} disabled={props.disabled}>
      <Tooltip title={props.tooltip} disableFocusListener={true}>
        <EditIcon color={props.disabled ? 'disabled' : 'secondary'} />
      </Tooltip>
    </IconButton>
  );
}
