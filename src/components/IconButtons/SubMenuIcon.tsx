import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import React from 'react';

interface SubMenuIconProps {
  title: string;
}

export default function SubMenuIcon(props: SubMenuIconProps) {
    const {title } = props;
    return (
      <IconButton style={{ padding: 6 }}>
        <img src={`/icons/${title}.svg`} alt="logo" width="24px" height="24px" style={{fill: 'white'}}/>
      </IconButton>
    );
}
