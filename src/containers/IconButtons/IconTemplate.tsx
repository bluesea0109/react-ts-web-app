import { Box, makeStyles } from '@material-ui/core';
import React from 'react';

interface PropsType {
  active: boolean;
}
const useStyles = makeStyles(() => ({
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
    color: (props: PropsType) => (props.active ? 'rgb(74, 144, 226)' : 'white'),
  },
}));

interface IconTemplateProps {
  name: string;
  active: boolean;
  [index: string]: any;
}

const IconTemplate: React.FC<IconTemplateProps> = ({
  active,
  name,
  children,
  ...props
}) => {
  const classes = useStyles({ active });
  return (
    <Box className={classes.root}>
      <Box className={classes.Icon}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          style={active ? { fill: 'rgb(74, 144, 226)' } : { fill: '#eee' }}
          {...props}>
          {children}
        </svg>
      </Box>
      <Box className={classes.Title}>
        <div>{name}</div>
      </Box>
    </Box>
  );
};

export default IconTemplate;
