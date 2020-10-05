import IconButton from '@material-ui/core/IconButton';

import React from 'react';

interface SubMenuIconProps {
  title: string;
}

export default function SubMenuIcon(props: SubMenuIconProps) {
    const {title } = props;
    return (
      <IconButton style={{ padding: '4px 15px 8px 15px'}}>
        <img src={`/icons/${title}.svg`} alt="logo" width="28px" height="28px" style={{fill: 'white'}}/>
      </IconButton>
    );
}
