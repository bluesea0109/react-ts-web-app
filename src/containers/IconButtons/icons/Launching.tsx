import {
  Box,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
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
    },
  }),
);

interface SVGProps {
  active: boolean;
}

const Launching = (props: SVGProps) => {
  const { active } = props;
  const classes = useStyles({ active });
  return (
    <Box className={classes.root}>
      <Box className={classes.Icon}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        style={active ? { fill: 'rgb(74, 144, 226)' } : { fill: '#eee' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.8414 0.802223C19.8412 0.803554 19.8412 0.804909 19.8414 0.80624C20.1572 2.18749 19.8102 4.29597 18.8886 6.58883C17.963 8.8924 16.5777 11.0647 15.0886 12.5495C14.6166 13.0249 14.1112 13.4657 13.5764 13.8687C13.616 14.8638 13.4748 15.7384 13.1555 16.4732C12.0267 19.0647 9.1314 19.792 7.93541 19.9848C7.87432 19.995 7.81249 20 7.75056 20C7.4373 19.9968 7.13988 19.8614 6.93127 19.6272C6.72265 19.393 6.62212 19.0815 6.65434 18.7692V18.7634L6.96615 15.8955L6.87038 15.8853C6.52127 15.8485 6.19548 15.6922 5.94788 15.4428L4.54966 14.0406C4.30118 13.7921 4.14548 13.4655 4.10869 13.1156C4.10734 13.1023 4.10583 13.0886 4.10426 13.0742C4.10219 13.0554 4.10002 13.0355 4.09799 13.0147L1.23296 13.3281H1.22717C0.881657 13.3634 0.539508 13.2351 0.301963 12.9812C0.0644175 12.7272 -0.041321 12.3768 0.0160348 12.0335C0.21158 10.8415 0.946102 7.93838 3.51804 6.80401C4.25612 6.48124 5.13229 6.33928 6.12695 6.38392C6.52994 5.85028 6.96977 5.34562 7.44321 4.87365C8.92027 3.39062 11.1056 2.00669 13.4379 1.06919C15.7519 0.140616 17.8401 -0.205367 19.1675 0.119187C19.5034 0.199959 19.7646 0.464659 19.8414 0.802223ZM12.2194 9.18335C13.1979 9.58928 14.3241 9.36431 15.0726 8.61338C15.5681 8.1242 15.8472 7.45624 15.8472 6.75914C15.8472 6.06204 15.5681 5.39408 15.0726 4.9049C14.3241 4.15397 13.1979 3.929 12.2194 4.33493C11.2409 4.74087 10.6027 5.69772 10.6027 6.75914C10.6027 7.82056 11.2409 8.77742 12.2194 9.18335Z"
        />
      </svg>
      </Box>
      <Box className={classes.Title}>
        <div>Launch</div>
      </Box>
    </Box>
  );
};

export default Launching;
