import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  grid: {
    flexGrow: 1
  }
});

function ContentLoading(props) {
  const { classes } = props;
  return (
    <Grid container direction="column" justify="center" alignItems="center" className={classes.grid}>
      <CircularProgress color="secondary" size={props.size}/>
    </Grid>
  );
}

ContentLoading.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContentLoading);
