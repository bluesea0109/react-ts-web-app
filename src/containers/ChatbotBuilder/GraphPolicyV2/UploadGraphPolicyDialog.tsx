import { withApollo, WithApolloClient } from '@apollo/client/react/hoc';
import { Button } from '@bavard/react-components';
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

class UploadGraphPolicyDialog extends React.Component<
  WithApolloClient<IUploadGraphPolicyDialogProps>,
  IUploadGraphPolicyDialogState
> {
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
  };

  onCancel = () => {
    this.props.onCancel();
  };

  onClose = () => {
    this.onCancel();
  };

  onSuccess = () => {
    this.setState({
      policySaved: true,
    });
    if (this.props.onSuccess) {
      this.props.onSuccess();
    }
  };

  render() {
    const state = this.state;

    const dialogContent = (
      <DialogContent>
        <DialogContentText>{state.status}</DialogContentText>
        <GraphPolicyUpload onSuccess={this.onSuccess} onError={this.onError} />
      </DialogContent>
    );

    return (
      <Dialog open={this.props.open} fullWidth={true}>
        <DialogTitle>{'Import Graph Policy File'}</DialogTitle>
        {dialogContent}
        <DialogActions>
          {state.policySaved ? (
            <Button title="Close" color="secondary" onClick={this.onClose} />
          ) : (
            <Button title="Cancel" color="secondary" onClick={this.onCancel} />
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

export default withApollo<IUploadGraphPolicyDialogProps>(
  UploadGraphPolicyDialog,
);
