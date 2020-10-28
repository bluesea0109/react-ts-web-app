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

const Dashboard = (props: SVGProps) => {
  const { active } = props;
  const classes = useStyles({ active });
  return (
    <Box className={classes.root}>
      <Box className={classes.Icon}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 20 18"
          xmlns="http://www.w3.org/2000/svg"
          style={active ? { fill: 'rgb(74, 144, 226)' } : { fill: '#eee' }}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.0145 2.90174C13.1977 -0.892219 7.06007 -0.976362 3.14074 2.71154C-0.778593 6.39945 -1.0677 12.5309 2.48724 16.5712L2.49472 16.5795L2.50689 16.5926C2.51634 16.6029 2.52581 16.6132 2.5363 16.6232C2.56707 16.6581 2.602 16.6976 2.64316 16.7387C2.96951 17.0856 3.42561 17.2809 3.90186 17.2775C4.3781 17.2742 4.83144 17.0727 5.15293 16.7213C6.39008 15.3767 8.13372 14.6117 9.96083 14.6117C11.7879 14.6117 13.5316 15.3767 14.7687 16.7213C15.0926 17.0746 15.5498 17.2759 16.0291 17.2764C16.5084 17.2768 16.9659 17.0764 17.2906 16.7238L17.424 16.5782L17.4315 16.5699C20.9293 12.6202 20.7471 6.62992 17.0157 2.90008L17.0145 2.90174ZM9.29306 3.30715C9.29306 2.93972 9.59091 2.64187 9.95834 2.64187C10.3258 2.64187 10.6236 2.93972 10.6236 3.30715V4.63771C10.6236 5.00513 10.3258 5.30299 9.95834 5.30299C9.59091 5.30299 9.29306 5.00513 9.29306 4.63771V3.30715ZM3.30553 10.6252H4.63609C5.00352 10.6252 5.30137 10.3274 5.30137 9.95995C5.30137 9.59253 5.00352 9.29467 4.63609 9.29467H3.30553C2.93811 9.29467 2.64025 9.59253 2.64025 9.95995C2.64025 10.3274 2.93811 10.6252 3.30553 10.6252ZM6.6652 6.66681C6.40543 6.92642 5.98443 6.92642 5.72466 6.66681L4.7837 5.72627C4.52386 5.46644 4.52386 5.04516 4.7837 4.78532C5.04354 4.52548 5.46482 4.52548 5.72466 4.78532L6.6652 5.72627C6.9248 5.98605 6.9248 6.40704 6.6652 6.66681ZM10.898 10.7666L12.8731 7.62731C13.0068 7.44 12.964 7.1799 12.7775 7.04519C12.6313 6.94331 12.4371 6.94331 12.291 7.04519L9.15168 9.02025C8.59792 9.42517 8.47315 10.2003 8.87189 10.7586C9.27063 11.3168 10.0444 11.4502 10.607 11.0577C10.719 10.9769 10.8172 10.8786 10.898 10.7666ZM14.192 6.66681C13.9305 6.91532 13.5185 6.91004 13.2634 6.65493C13.0083 6.39981 13.003 5.98784 13.2515 5.72627L14.192 4.78532C14.4519 4.52548 14.8731 4.52548 15.133 4.78532C15.3928 5.04516 15.3928 5.46644 15.133 5.72627L14.192 6.66681ZM15.2806 10.6252H16.6111C16.9786 10.6252 17.2764 10.3274 17.2764 9.95995C17.2764 9.59253 16.9786 9.29467 16.6111 9.29467H15.2806C14.9132 9.29467 14.6153 9.59253 14.6153 9.95995C14.6153 10.3274 14.9132 10.6252 15.2806 10.6252Z"
          />{' '}
        </svg>{' '}
      </Box>
      <Box className={classes.Title}>
        <div>Dashboard</div>
      </Box>
    </Box>
  );
};

export default Dashboard;
