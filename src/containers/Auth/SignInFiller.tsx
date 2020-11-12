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
    fillerTextBox: {
      position: 'absolute',
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10),
      zIndex: 11,
    },
  }),
);

const SignInFiller = () => {
  const classes = useStyles();

  return (
    <>
      <Grid item={true} sm={12} lg={6} xl={5} className={classes.fillerTextBox}>
        <Box pb={4}>
          <Typography variant="h4" style={{ color: 'white' }}>
            Engage your customers with smart, automated conversation.
          </Typography>
        </Box>
        <Typography variant="h6" style={{ color: 'white' }}>
          Our services can help you automate your e-commerce sales, lead
          generation, and customer engagement.
        </Typography>
      </Grid>
      <img src={'/chatbot-phone.png'} alt="Phone with Chatbot" />
    </>
  );
};

export default SignInFiller;
