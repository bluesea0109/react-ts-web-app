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

const Configuration = (props: SVGProps) => {
  const { active } = props;
  const classes = useStyles({ active });
  return (
    <Box className={classes.root}>
      <Box className={classes.Icon}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={active ? { fill: 'rgb(74, 144, 226)' } : { fill: '#eee' }}>
          <path d="M0.769231 3.27273H11.6707C11.9969 4.25307 12.8684 4.9084 13.8462 4.9084C14.8239 4.9084 15.6955 4.25307 16.0216 3.27273H19.2308C19.6556 3.27273 20 2.90642 20 2.45455C20 2.00268 19.6556 1.63637 19.2308 1.63637H16.0216C15.6955 0.656023 14.8239 0.000701904 13.8462 0.000701904C12.8684 0.000701904 11.9969 0.656023 11.6707 1.63637H0.769231C0.344396 1.63637 0 2.00268 0 2.45455C0 2.90642 0.344396 3.27273 0.769231 3.27273Z" />
          <path d="M19.2308 14.7273H16.0216C15.6955 13.7469 14.8239 13.0916 13.8462 13.0916C12.8684 13.0916 11.9969 13.7469 11.6707 14.7273H0.769231C0.344396 14.7273 0 15.0936 0 15.5455C0 15.9973 0.344396 16.3636 0.769231 16.3636H11.6707C11.9969 17.344 12.8684 17.9993 13.8462 17.9993C14.8239 17.9993 15.6955 17.344 16.0216 16.3636H19.2308C19.6556 16.3636 20 15.9973 20 15.5455C20 15.0936 19.6556 14.7273 19.2308 14.7273Z" />
          <path d="M19.2308 8.18182H8.32933C8.00315 7.20148 7.13155 6.54616 6.15385 6.54616C5.17614 6.54616 4.30455 7.20148 3.97837 8.18182H0.769231C0.344396 8.18182 0 8.54814 0 9C0 9.45187 0.344396 9.81819 0.769231 9.81819H3.97837C4.30455 10.7985 5.17614 11.4539 6.15385 11.4539C7.13155 11.4539 8.00315 10.7985 8.32933 9.81819H19.2308C19.6556 9.81819 20 9.45187 20 9C20 8.54814 19.6556 8.18182 19.2308 8.18182Z" />
        </svg>
      </Box>
      <Box className={classes.Title}>
        <div>Configure</div>
      </Box>
    </Box>
  );
};

export default Configuration;
