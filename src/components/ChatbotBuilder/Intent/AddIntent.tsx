import { useMutation } from '@apollo/client';
import { Box, CircularProgress, DialogContent, Divider, Grid, LinearProgress, TextField } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import { Check, Close, Delete } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { Autocomplete } from '@material-ui/lab';
import gql from 'graphql-tag';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { CHATBOT_CREATE_TAGS, CHATBOT_GET_TAGS } from '../../../common-gql-queries';
import { AnyAction } from '../../../models/chatbot-service';
import { AddExampleItem } from '../Examples/AddExamples';
import { createIntentMutation, getIntentsQuery } from './gql';

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
    mutation ($agentId: Int!, $examples: [ChatbotService_ExampleInput!]!) {
        ChatbotService_uploadExamples(agentId: $agentId, examples: $examples)
    }
`;

type AddIntentProps = {
  actions: AnyAction[];
  onAddIntentClose: () => void;
  tags: any[];
};

const AddIntent = (props: AddIntentProps) => {
  const classes = useStyles();
  const { onAddIntentClose, actions, tags } = props;
  const [loading, setLoading] = useState(false);
  const [newIntent, setNewIntent] = useState({
    value: '',
    defaultAction: null,
  });
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const [tag, setTag] = useState<string>('');
  const [addTag, setAddTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [examples, setExamples] = useState<any[]>([]);
  const lastID = useRef(0);
  const { enqueueSnackbar } = useSnackbar();

  const updateTag = (e: ChangeEvent<{}>, tag: any) => setTag(tag?.value ?? '');

  const onExampleUpdate = (id: number) => (updatedExample: any) => {
    const index = examples.findIndex(ex => ex.id === id);
    const updatedExamples = Array.from([...examples]);
    updatedExamples.splice(index, 1, {
      ...updatedExample,
      intentId: undefined,
      intentName: undefined,
    });

    setExamples([ ...updatedExamples ]);
  };

  const onAddExample = () => {
    const currentExamples = Array.from([...examples]);
    setExamples([
      ...currentExamples,
      {
        id: lastID.current + 1,
        intentId: undefined,
        agentId: numAgentId,
        tags: [],
        text: '',
      },
    ]);

    lastID.current = lastID.current + 1;
  };

  const onDeleteExample = (id: number) => () => {
    const index = examples.findIndex(ex => ex.id === id);
    const updatedExamples = Array.from([...examples]);
    updatedExamples.splice(index, 1);

    setExamples([ ...updatedExamples ]);
  };

  const [createExamples] = useMutation(createExamplesMutation);
  const [createTags] = useMutation(CHATBOT_CREATE_TAGS,  {
    refetchQueries: [{ query: CHATBOT_GET_TAGS, variables: { agentId : numAgentId }  }],
    awaitRefetchQueries: true,
  });
  const [createIntent] = useMutation(createIntentMutation, {
    refetchQueries: [{ query: getIntentsQuery, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true,
  });

  const saveChanges = async () => {
    if (newIntent.value === '') {
      enqueueSnackbar('Intent can\'t be empty', { variant: 'warning' });
      return;
    }

    const hasNoEmptyExamples = examples.reduce((prev, curr) => prev && !!curr.text, true);

    if (!hasNoEmptyExamples) {
      enqueueSnackbar('Please make sure no example is empty before proceeding', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);

      const { value, defaultAction } = newIntent;
      const resp = await createIntent({
        variables: {
          agentId: numAgentId,
          intents: [
            { value, defaultAction: defaultAction !== -1 ? defaultAction : null },
          ],
        },
      });

      enqueueSnackbar('Intent created successfully', { variant: 'success' });

      if (examples.length > 0) {
        const intentID = resp.data?.ChatbotService_createIntents?.[0]?.id;

        if (!intentID) {
          throw new Error('Invalid Intent ID');
        }

        await createExamples({
          variables: {
            agentId: numAgentId,
            examples: examples.map(ex => ({
              text: ex.text,
              intentId: intentID,
              tags: ex.tags.map((tag: any) => ({
                start: tag.start,
                end: tag.end,
                tagTypeId: tag.tagType.id,
              })),
            })),
          },
        });

        enqueueSnackbar('Examples created successfully', { variant: 'success' });
      }

      onAddIntentClose();
    } catch (e) {
      enqueueSnackbar('Unable to create examples.', { variant: 'error' });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createTag = async () => {
    if (newTag === '') {
      enqueueSnackbar('Can\'t create empty tag', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);
      await createTags({
        variables: {
          agentId: numAgentId,
          values: [newTag],
        },
      });
      setNewTag('');
      setAddTag(false);
    } catch (e) {
      enqueueSnackbar('Unable to create tag.', { variant: 'error' });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog fullScreen={true} open={true} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton disabled={loading} edge="start" color="inherit" onClick={onAddIntentClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Create New Intent
          </Typography>
          <Button disabled={loading} autoFocus={true} color="inherit" onClick={saveChanges}>
            {loading && (
              <CircularProgress
                color="secondary"
                size={20}
              />
            )}
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
                  label="Intent Value (No Spaces Allowed)"
                  disabled={loading}
                  variant="outlined"
                  value={newIntent.value}
                  onChange={e => setNewIntent({ ...newIntent, value: e.target.value.replace(/ /g, '+') })}
                />
              </Box>
            </Grid>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <Autocomplete
                  fullWidth={true}
                  disabled={loading}
                  id="intentDefaultActionSelector"
                  options={actions}
                  getOptionLabel={(option: AnyAction) => option.name}
                  value={actions.find(a => a.id === newIntent?.defaultAction)}
                  onChange={(e, action) => setNewIntent({ ...newIntent, defaultAction: action?.id } as any)}
                  renderInput={(params) => <TextField {...params} label="Default Action" variant="outlined" />}
                />
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Grid container={true}>
              <Grid item={true} xs={6}>
                <Box px={2} my={5}>
                  {addTag && (
                    <Grid container={true} alignItems="center" spacing={2}>
                      <Grid item={true} style={{ flexGrow: 1 }}>
                        <TextField
                          fullWidth={true}
                          id="name"
                          label="New Tag Name"
                          type="text"
                          value={newTag}
                          variant="outlined"
                          onChange={(e: any) => setNewTag(e.target.value.replace(/ /g, '_') as string)}
                        />
                      </Grid>
                      <Grid item={true}>
                        <IconButton onClick={createTag}>
                          <Check />
                        </IconButton>
                      </Grid>
                      <Grid item={true}>
                        <IconButton onClick={() => {
                          setNewTag('');
                          setAddTag(false);
                        }}>
                          <Close />
                        </IconButton>
                      </Grid>
                    </Grid>
                  )}
                  {!addTag && (
                    <Grid container={true} alignItems="center" spacing={2}>
                      <Grid item={true} style={{ flexGrow: 1 }}>
                        <Autocomplete
                          fullWidth={true}
                          disableClearable={true}
                          disabled={loading}
                          id="tagSelector"
                          options={tags}
                          getOptionLabel={(option: any) => option.value}
                          value={tags.find(t => t.value === tag) ?? null as any}
                          onChange={updateTag}
                          renderInput={(params) => <TextField {...params} label="Selected Tag Type" variant="outlined" />}
                        />
                      </Grid>
                      <Grid item={true}>
                        <Button
                          variant="contained"
                          color="secondary"
                          style={{ height: 52 }}
                          onClick={() => setAddTag(true)}
                        >Add New</Button>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Grid>
              {examples.map(example => (
                <Grid key={example.id} item={true} xs={12}>
                  <Divider variant="middle" />
                  <Box p={4}>
                    <Grid container={true} alignItems="center" spacing={2}>
                      <Grid item={true}>
                        <Typography variant="h6">Example #{example.id}</Typography>
                      </Grid>
                      <Grid item={true}>
                        <IconButton onClick={onDeleteExample(example.id)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                  <AddExampleItem
                    loading={loading}
                    example={example}
                    tag={tag}
                    tags={tags}
                    onExampleUpdate={onExampleUpdate(example.id)}
                  />
                </Grid>
              ))}
            </Grid>
            <Box mt={3} display="flex" justifyContent="center" mb={4}>
              <Button disabled={loading} variant="contained" color="primary" onClick={onAddExample}>Add New Item</Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddIntent;
