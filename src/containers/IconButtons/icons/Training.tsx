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

const Training = (props: SVGProps) => {
  const { active } = props;
  const classes = useStyles({ active });
  return (
    <Box className={classes.root}>
      <Box className={classes.Icon}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 20 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={active ? { fill: 'rgb(74, 144, 226)' } : { fill: '#eee' }}>
          <path d="M10 13.2504C9.88685 13.2504 9.77566 13.222 9.67744 13.168L3.9875 10.0419C3.88687 9.98601 3.76288 9.98605 3.66229 10.042C3.56171 10.0979 3.49983 10.2012 3.5 10.3129V13.2504C3.4998 13.4775 3.62782 13.6869 3.83434 13.7972L9.68434 16.9214C9.88065 17.0262 10.1193 17.0262 10.3157 16.9214L16.1657 13.7972C16.3722 13.6869 16.5002 13.4775 16.5 13.2504V10.3129C16.5002 10.2012 16.4383 10.0979 16.3377 10.042C16.2371 9.98605 16.1131 9.98601 16.0125 10.0419L10.3226 13.168C10.2243 13.222 10.1131 13.2504 10 13.2504Z" />
          <path d="M19.9967 5.9375C19.9967 5.9375 19.9967 5.93417 19.9967 5.93292C19.9748 5.71851 19.8506 5.5279 19.6633 5.42125L10.3304 0.0878808C10.1254 -0.0292936 9.87372 -0.0292936 9.66873 0.0878808L0.335757 5.42125C0.128126 5.53997 0 5.76082 0 6C0 6.23919 0.128126 6.46004 0.335757 6.57876L9.66873 11.9121C9.87372 12.0293 10.1254 12.0293 10.3304 11.9121L18.5417 7.22001C18.5676 7.2051 18.5994 7.20513 18.6252 7.2201C18.651 7.23506 18.6668 7.26268 18.6667 7.29251V13.3146C18.6667 13.6734 18.9425 13.9813 19.3013 13.9992C19.4834 14.008 19.6612 13.9418 19.7932 13.816C19.9253 13.6902 20 13.5158 20 13.3334V6C20 5.97913 19.9988 5.95827 19.9967 5.9375Z" />
        </svg>
      </Box>
      <Box className={classes.Title}>
        <div>Training</div>
      </Box>
    </Box>
  );
};

export default Training;
