import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
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
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class ReviewQueueDelete extends React.Component {
  state = {
    open: false,
    deleting: false
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
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

  render() {
    const { queue } = this.props;

    let dialogContent = (
      <React.Fragment>
        <DialogContent>
          <DialogContentText>
            {`Id: ${queue.id}`}
          </DialogContentText>
          <DialogContentText>
            {`Name: ${queue.name}`}
          </DialogContentText>
          <DialogContentText>
            {"Are you sure you want to delete this queue?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={this.handleClose}>
            {"Cancel"}
          </SecondaryButton>
          <PrimaryButton onClick={this.handleDeleteQueue}>
            {"Delete"}
          </PrimaryButton>
        </DialogActions>
      </React.Fragment>
    );

    if (this.state.deleting) {
      dialogContent = (
        <React.Fragment>
          <DialogContent>
            <DialogContentText>
              {"Deleting"}
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
          <DialogTitle>{"Delete Labeling Queue"}</DialogTitle>
          {dialogContent}
        </Dialog>
        <IconButton onClick={this.handleOpen} style={{ padding: 6 }}>
          <Tooltip title="Delete Labeling Queue" disableFocusListener={true}>
            <DeleteIcon color="secondary" />
          </Tooltip>
        </IconButton>
      </React.Fragment>
    );
  }
}

ReviewQueueDelete.propTypes = {
  queue: PropTypes.object.isRequired,
};

const deleteQueue = gql`
  mutation ($queueId: Int!)  {
    reviewQueueDelete(queueId: $queueId) {
      id
      name
      collectionId
    }
  }
`;

export default compose(
  graphql(deleteQueue, { name: 'deleteQueue' }),
)(ReviewQueueDelete);

