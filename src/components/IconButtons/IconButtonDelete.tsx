import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';

interface IIconButtonProps {
  onClick(): any;
  tooltip: string;
  disabled?: false;
}

export default function IconButtonDelete(props: IIconButtonProps) {
  return (
    <IconButton onClick={props.onClick} style={{ padding: 6 }} disabled={props.disabled}>
      <Tooltip title={props.tooltip} disableFocusListener={true}>
        <DeleteIcon color={props.disabled ? 'disabled' : 'secondary'} />
      </Tooltip>
    </IconButton>
  );
}
