import { useMutation } from '@apollo/client';
import {
  Box,
  CircularProgress,
  DialogContent,
  Divider,
  Grid,
  LinearProgress,
  TextField,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import gql from 'graphql-tag';
import { useSnackbar } from 'notistack';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';
import { AnyAction } from '../../../models/chatbot-service';
import { createSlotMutation, getSlotsQuery } from './gql';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const createExamplesMutation = gql`
  mutation($agentId: Int!, $examples: [ChatbotService_ExampleInput!]!) {
    ChatbotService_uploadExamples(agentId: $agentId, examples: $examples)
  }
`;

type AddSlotProps = {
  onAddSlotClose: () => void;
};

const AddSlot = (props: AddSlotProps) => {
  const classes = useStyles();
  const { onAddSlotClose } = props;
  const [loading, setLoading] = useState(false);
  const [newSlot, setNewSlot] = useState({
    name: '',
    type: '',
  });
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const lastID = useRef(0);
  const { enqueueSnackbar } = useSnackbar();

  const [createSlot] = useMutation(createSlotMutation, {
    refetchQueries: [
      { query: getSlotsQuery, variables: { agentId: numAgentId } },
    ],
    awaitRefetchQueries: true,
  });

  const saveChanges = async () => {
    if (newSlot.name === '' || newSlot.type === '') {
      enqueueSnackbar('Slot can\'t be empty', { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);

      const { name, type } = newSlot;
      const resp = await createSlot({
        variables: {
          agentId: numAgentId,
          slots: [
            {
              name,
              type,
            },
          ],
        },
      });

      enqueueSnackbar('Slot created successfully', { variant: 'success' });
      onAddSlotClose();
    } catch (e) {
      enqueueSnackbar('Unable to create slot.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog fullScreen={true} open={true} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            disabled={loading}
            edge="start"
            color="inherit"
            onClick={onAddSlotClose}
            aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Create New Slot
          </Typography>
          <Button
            disabled={loading}
            autoFocus={true}
            color="inherit"
            onClick={saveChanges}>
            {loading && <CircularProgress color="secondary" size={20} />}
            Create
          </Button>
        </Toolbar>
        {loading && <LinearProgress color="secondary" />}
      </AppBar>
      <DialogContent>
        <Box my={4}>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextField
                  fullWidth={true}
                  label="Slot Name"
                  disabled={loading}
                  variant="outlined"
                  value={newSlot.name}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      name: e.target.value,
                    })
                  }
                />
              </Box>
            </Grid>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextField
                  fullWidth={true}
                  label="Slot Type"
                  disabled={loading}
                  variant="outlined"
                  value={newSlot.type}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      type: e.target.value,
                    })
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddSlot;
