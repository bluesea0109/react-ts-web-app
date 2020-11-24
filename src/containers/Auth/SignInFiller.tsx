import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filler: {
      background: 'linear-gradient(45deg, #1565c0 30%, #29b6f6 90%)',
    },
    fillerTextBox: {
      padding: theme.spacing(5),
      zIndex: 11,

      '@media (max-width: 1000px)': {
        padding: theme.spacing(3),
      },
      '@media (max-width: 600px)': {
        padding: theme.spacing(2),
      },
    },
    fillerTitle: {
      fontSize: 30,
      '@media (max-width: 600px)': {
        fontSize: 20,
      },
    },
    fillerBody: {
      fontSize: 20,
      '@media (max-width: 600px)': {
        fontSize: 16,
      },
    },
    imageBox: {
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    fillerImage: {
      width: 400,
      height: 600,
      paddingRight: theme.spacing(5),

      '@media (max-width: 1000px)': {
        paddingRight: theme.spacing(3),
        width: 300,
        height: 450,
      },
      '@media (max-width: 600px)': {
        paddingRight: theme.spacing(2),
        width: 200,
        height: 300,
      },
    },
  }),
);

const SignInFiller = () => {
  const classes = useStyles();

  return (
    <Grid item={true} container={true} xs={8} className={classes.filler}>
      <Grid item={true} xs={12} className={classes.fillerTextBox}>
        <Box pb={4}>
          <Typography
            style={{ color: 'white' }}
            className={classes.fillerTitle}>
            Engage your customers with smart, automated conversation.
          </Typography>
        </Box>
        <Typography style={{ color: 'white' }} className={classes.fillerBody}>
          Our services can help you automate your e-commerce sales, lead
          generation, and customer engagement.
        </Typography>
      </Grid>
      <Grid item={true} xs={12} className={classes.imageBox}>
        <img
          src={'/chatbot-phone.png'}
          alt="Phone with Chatbot"
          className={classes.fillerImage}
        />
      </Grid>
    </Grid>
  );
};

export default SignInFiller;
