import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

interface PropsType {
  active: boolean;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      padding: '0px',
      flexFlow: 'column',
    },
    Icon: {
      width: '45px',
      height: '45px',
      padding: '0px 15px',
      borderRight: (props: PropsType) =>
        props.active ? '5px solid rgb(74, 144, 226)' : 'none',
    },
    Title: {
      display: 'flex',
      width: '75px',
      padding: '10px 0px',
      justifyContent: 'center',
      fontSize: '11px',
      borderRight: (props: PropsType) =>
        props.active ? '5px solid rgb(74, 144, 226)' : 'none',
      color: (props: PropsType) =>
        props.active ? 'rgb(74, 144, 226)' : 'white',
    },
  }),
);

interface SVGProps {
  active: boolean;
}

const TextLabeling = (props: SVGProps) => {
  const { active } = props;
  const classes = useStyles({ active });
  return (
    <Box className={classes.root}>
      <Box className={classes.Icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 512 512"
          style={active ? { fill: 'rgb(74, 144, 226)' } : { fill: '#eee' }}>
          <title>ionicons-v5-k</title>
          <path d="M428,224H288a48,48,0,0,1-48-48V36a4,4,0,0,0-4-4H144A64,64,0,0,0,80,96V416a64,64,0,0,0,64,64H368a64,64,0,0,0,64-64V228A4,4,0,0,0,428,224ZM336,384H176a16,16,0,0,1,0-32H336a16,16,0,0,1,0,32Zm0-80H176a16,16,0,0,1,0-32H336a16,16,0,0,1,0,32Z" />
          <path d="M419.22,188.59,275.41,44.78A2,2,0,0,0,272,46.19V176a16,16,0,0,0,16,16H417.81A2,2,0,0,0,419.22,188.59Z" />
        </svg>
      </Box>
      <Box className={classes.Title}>
        <div>Text Labeling</div>
      </Box>
    </Box>
  );
};

export default TextLabeling;
