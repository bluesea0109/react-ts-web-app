import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';

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
  }),
);

const ErrorTitle = 'Sorry, Something Went Wrong';
const ErrorDescription =
  'There was an internal server error. Our engineers have been \n notified and are working to resove the issue as soon as possible.';

const InternalServerErrorPage = () => {
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
            <img src={'/cloud_error.png'} alt="cloud_error_msg" width="200px" height="140px"/>
          </Grid>
        <Grid>
          <Typography variant="h4" style={{ marginBottom: '20px' }}>
            {ErrorTitle}
          </Typography>
        </Grid>
        <Grid>
          <Typography
            component="p"
            paragraph={true}
            style={{ whiteSpace: 'pre-line' }}>
            {ErrorDescription}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
    </Grid>
  );
};

export default InternalServerErrorPage;
