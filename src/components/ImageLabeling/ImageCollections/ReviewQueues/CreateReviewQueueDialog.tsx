import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import gql from "graphql-tag";
import { graphql } from 'react-apollo';
import ContentLoading from './ContentLoading';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  dialogPaper: {
    minHeight: 400
  },
});

class ReviewQueueCreate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      loading: false,
      queueName: ''
    };
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

  handleCreateQueue = async () => {
    this.setState({ loading: true });
    await this.props.createQueue({
      variables: {
        collectionId: this.props.match.params.collectionId,
        name: this.state.queueName
      }
    });
    this.setState({ loading: false, open: false });
    if (this.props.onCompleted) {
      this.props.onCompleted();
    }
  };

  createDisabled = () => {
    return !this.state.queueName
  }

  render() {
    const { classes } = this.props;
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
                  label="Queue Name"
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
          <PrimaryButton onClick={this.handleCreateQueue} disabled={this.createDisabled()}>
            {"Create"}
          </PrimaryButton>
        </DialogActions>
      </React.Fragment>
    );

    if (this.props.loading) {
      dialogContent = (
        <React.Fragment>
          <DialogContent>
            <DialogContentText>
              {"Loading"}
            </DialogContentText>
            <ContentLoading />
          </DialogContent>
        </React.Fragment>
      );
    }

    if (this.state.loading) {
      dialogContent = (
        <React.Fragment>
          <DialogContent>
            <DialogContentText>
              {"Creating"}
            </DialogContentText>
            <ContentLoading />
          </DialogContent>
        </React.Fragment>
      );
    }

    return (
      <div className={classes.root} color="inherit" >
        <Dialog
          fullWidth={true}
          open={this.state.open}
          onClose={this.handleClose}
          classes={{ paper: classes.dialogPaper }}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{"New Labeling Queue"}</DialogTitle>
          {dialogContent}
        </Dialog>
        <IconButton onClick={this.handleOpen} style={{ padding: 6 }}>
          <Tooltip title="New Labeling Queue" disableFocusListener={true}>
            <AddIcon color="secondary" />
          </Tooltip>
        </IconButton>
      </div>
    );
  }
}

ReviewQueueCreate.propTypes = {
  classes: PropTypes.object.isRequired,
};

const createQueue = gql`
  mutation ($collectionId: String!, $name: String!)  {
    reviewQueueCreate(collectionId: $collectionId, name: $name) {
      id
      name
      collectionId
    }
  }
`;

export default compose(
  withRouter,
  graphql(createQueue, { name: 'createQueue' }),
  withStyles(styles)
)(ReviewQueueCreate);

