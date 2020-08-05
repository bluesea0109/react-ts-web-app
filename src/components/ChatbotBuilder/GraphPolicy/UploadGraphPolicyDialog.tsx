import { withApollo, WithApolloClient } from '@apollo/client/react/hoc';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GraphQLError } from 'graphql';
import React from 'react';
import GraphPolicyUpload from './GraphPolicyUpload';

interface IUploadGraphPolicyDialogProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

interface IUploadGraphPolicyDialogState {
  open: boolean;
  error: GraphQLError | Error | null;
  status: string;
  policySaved: boolean;
}

class UploadGraphPolicyDialog extends React.Component<WithApolloClient<IUploadGraphPolicyDialogProps>, IUploadGraphPolicyDialogState> {
  constructor(props: IUploadGraphPolicyDialogProps) {
    super(props);

    this.state = {
      open: props.open,
      policySaved: false,
      error: null,
      status: '',
    };
  }

  onError = (error?: Error) => {
    this.setState({
      error: error || null,
      status: error?.message || '',
    });
  }

  onCancel = () => {
    this.props.onCancel();
  }

  onClose = () => {
    this.onCancel();
  }

  onSuccess = () => {
    this.setState({
      policySaved: true,
    });
    if (this.props.onSuccess) {
      this.props.onSuccess();
    }
  }

  render() {
    const state = this.state;

    const dialogContent = (
      <DialogContent>
        <DialogContentText>
          {state.status}
        </DialogContentText>
        <GraphPolicyUpload onSuccess={this.onSuccess} onError={this.onError}/>
      </DialogContent>
    );

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          fullWidth={true}
        >
          <DialogTitle>{'Import Graph Policy File'}</DialogTitle>
          {dialogContent}
          <DialogActions>
            {
              state.policySaved
              ?
              <Button color="secondary" onClick={this.onClose}>
                {'Close'}
              </Button>
              :
              <Button color="secondary" onClick={this.onCancel}>
                {'Cancel'}
              </Button>
            }

          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withApollo<IUploadGraphPolicyDialogProps>(UploadGraphPolicyDialog);
