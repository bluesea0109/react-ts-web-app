import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerIcon: {
      display: 'flex',
      justifyContent: 'left',
      textAlign: 'left',
      marginTop: '30px',
      marginLeft: '20px',
    },

    title: {
      marginLeft: '5px',
      marginTop: '10px',
    },
    svg: {
      marginTop: '100px',
      width: '35%',
      textAlign: 'center',
    },
    img: {
      marginBottom: '50px',
    },
    content: {
      padding: '30px',
      borderRadius: '10px',
      backgroundColor: 'white',
      boxShadow: '0px 2px 3px lightgray',
    },
  }),
);

const NoWorkspacePage = () => {
  const classes = useStyles();
  return (
    <Grid container={true}>
      <Grid className={classes.headerIcon}>
        <Grid item={true}>
          <img src={'/logo192.png'} alt="logo" width="50px" height="50px" />
        </Grid>
        <Grid item={true}>
          <Typography className={classes.title} variant="h6">
            Bavard
          </Typography>
        </Grid>
      </Grid>
      <Grid container={true} className={classes.root}>
        <Grid className={classes.svg}>
          <Grid className={classes.img}>
            <img
              src={'/icons/no-workspace.png'}
              alt="no-workspace-project"
              width="150px"
              height="150px"
            />
          </Grid>
          <Grid>
            <Typography variant="h4" style={{ marginBottom: '20px' }}>
              No Workspaces
            </Typography>
          </Grid>
          <Grid>
            <Typography
              component="h6"
              paragraph={true}
              className={classes.content}>
              No Workspace is active. Please click.
              <Link to="/"> here </Link> to create a new Workspace.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NoWorkspacePage;
