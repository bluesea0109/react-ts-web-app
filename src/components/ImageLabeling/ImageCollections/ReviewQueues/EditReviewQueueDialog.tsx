import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import ContentLoading from './ContentLoading';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  memberSelect: {
    marginTop: theme.spacing.unit * 4
  },
  dialogPaper: {
    minHeight: 400
  },
});


class ReviewQueueDelete extends React.Component {
  state = {
    open: false,
    deleting: false,
    queueName: this.props.queue.name
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleDeleteQueue = async () => {
    this.setState({ deleting: true });
    await this.props.deleteQueue({
      variables: {
        queueId: this.props.queue.id
      }
    });
    if (this.props.onCompleted) {
      this.props.onCompleted();
    }
  };

  saveDisabled = () => {
    return true;
  }

  render() {
    const { classes, queue } = this.props;
    
    let dialogContent = (
      <React.Fragment>
        <DialogContent>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <form className={classes.container} noValidate autoComplete="off">
                <TextField
                  value={this.state.queueName}
                  onChange={this.handleChange('queueName')}
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Name"
                  type="string"
                  fullWidth
                />
              </form>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={this.handleClose}>
            {"Cancel"}
          </SecondaryButton>
          <PrimaryButton onClick={this.handleCreateQueue} disabled={this.saveDisabled()}>
            {"Create"}
          </PrimaryButton>
        </DialogActions>
      </React.Fragment>
    );

    if (this.state.deleting) {
      dialogContent = (
        <React.Fragment>
          <DialogContent>
            <DialogContentText>
              {"Saving"}
            </DialogContentText>
            <ContentLoading />
          </DialogContent>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Dialog
          fullWidth={true}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>{"Edit Labeling Queue"}</DialogTitle>
          {dialogContent}
        </Dialog>
        <IconButton onClick={this.handleOpen} style={{ padding: 6 }}>
          <Tooltip title="Edit Labeling Queue" disableFocusListener={true}>
            <EditIcon color="secondary" />
          </Tooltip>
        </IconButton>
      </React.Fragment>
    );
  }
}

ReviewQueueDelete.propTypes = {
  classes: PropTypes.object.isRequired,
  queue: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(styles)
)(ReviewQueueDelete);

