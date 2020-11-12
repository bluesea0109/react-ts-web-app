import { createStyles } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import ContentLoading from '../containers/ContentLoading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loader: {
      display: 'flex',
      width: '100%',
      height: '100%',
      minWidth: '100%',
      minHeight: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      background: `rgba(255, 255, 255, .5)`,
      alignContent: 'center',
      justifyItems: 'center',
      zIndex: 30,
    },
  }),
);

const Loader = () => {
  const classes = useStyles();

  return (
    <div className={classes.loader}>
      <ContentLoading />
    </div>
  );
};

export default Loader;
