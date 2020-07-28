import React from 'react';
import ApolloClient from 'apollo-client';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withApollo } from 'react-apollo';
import { GraphQLError } from 'graphql';

interface IUpsertGraphPolicyDialogProps {
  client: ApolloClient<object>;
}

interface IUpsertGraphPolicyDialogState {
  open: boolean;
  progress: number;
  numCompleted: number;
  total: number;
  error: GraphQLError | null;
  status: string;
}

class UpsertGraphPolicyDialog extends React.Component<IUpsertGraphPolicyDialogProps, IUpsertGraphPolicyDialogState> {
  constructor(props: IUpsertGraphPolicyDialogProps) {
    super(props);

    this.state = {
      open: true,
      progress: 0.0,
      numCompleted: 0,
      total: 1,
      error: null,
      status: '',
    };
  }
  handleJsonFile() {

  }
  handleClose() {
    
  }
  onCancel() {

  }
  render() {
    const state = this.state;

    let dialogContent = (
      <DialogContent>
        <DialogContentText>
          {state.status}
        </DialogContentText>
        <LinearProgress color="secondary" variant="determinate" value={state.progress} />
      </DialogContent>
    );

    if (state.error) {
      console.error(state.error);
      dialogContent = (
        <DialogContent>
          <DialogContentText>
            {'Something went wrong :('}
          </DialogContentText>
          <Typography>{'Please contact support@bavard.ai'}</Typography>
        </DialogContent>
      );
    }

    return (
      <React.Fragment>
        <Dialog
          open={state.open}
          onClose={this.handleClose}
          fullWidth={true}
        >
          <DialogTitle>{'Upload Agent Data'}</DialogTitle>
          {dialogContent}
          <DialogActions>
            {
              this.state.progress === 100
              ?
              <Button color="secondary" onClick={this.handleClose}>
                {'Close'}
              </Button>
              :
              <Button color="secondary" onClick={this.onCancel}>
                {'Cancel'}
              </Button>
            }
          </DialogActions>
        </Dialog>
        <Button
          variant="contained"
          component="label"
          style={{ padding: 6 }}>
          {'Upload JSON File'}
          <input
            name="json"
            id="json"
            accept="application/JSON"
            type="file"
            style={{ display: 'none' }}
            multiple={false}
            onChange={this.handleJsonFile}
          />
        </Button>
      </React.Fragment>
    );
  }
}

export default withApollo<IUpsertGraphPolicyDialogProps>(UpsertGraphPolicyDialog);
