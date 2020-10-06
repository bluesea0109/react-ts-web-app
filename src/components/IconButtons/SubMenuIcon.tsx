import IconButton from '@material-ui/core/IconButton';

import React from 'react';

interface SubMenuIconProps {
  title: string;
}

export default function SubMenuIcon(props: SubMenuIconProps) {
    const {title } = props;
    return (
      <IconButton style={{ padding: '4px 20px 8px 20px'}}>
        <img src={`/icons/${title}.svg`} alt="logo" width="28px" height="28px" style={{fill: 'white'}}/>
      </IconButton>
    );
}
