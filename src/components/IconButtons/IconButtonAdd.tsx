import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';

interface IconButtonAddProps {
  onClick(): any;
  tooltip: string;
  disabled?: false;
}

export default function IconButtonAdd(props: IconButtonAddProps) {
    return (
      <IconButton onClick={props.onClick} style={{ padding: 6 }} disabled={props.disabled}>
        <Tooltip title={props.tooltip} disableFocusListener={true}>
          <AddIcon color={props.disabled ? 'disabled' : 'secondary'}/>
        </Tooltip>
      </IconButton>
    );
}
