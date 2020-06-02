import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';

interface ExtendedIconButtonProps extends IconButtonProps {
  tooltip: string;
}

export default function IconButtonDelete(props: ExtendedIconButtonProps) {
  const { tooltip, disabled, ...rest } = props;
  return (
    <IconButton {...rest} style={{ padding: 6 }} disabled={disabled}>
      <Tooltip title={tooltip} disableFocusListener={true}>
        <DeleteIcon color={disabled ? 'disabled' : 'secondary'}  />
      </Tooltip>
    </IconButton>
  );
}
