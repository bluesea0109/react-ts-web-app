import { useMutation } from '@apollo/client';
import { Box, Button, CircularProgress, Divider, Grid, LinearProgress, TextField } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import { Add, Check, Close, Delete } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { Autocomplete } from '@material-ui/lab';
import gql from 'graphql-tag';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { TextAnnotator } from 'react-text-annotate';
import { CHATBOT_CREATE_TAGS, CHATBOT_GET_TAGS } from '../../../common-gql-queries';
import { IExample, IIntent } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { ExamplesError } from './types';
import { useEditExampleAnnotation } from './useEditExample';

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

const AddExamples = ({
   intents,
   tags,
   onEditExampleClose,
   refetchOptions,
}: {
  intents: IIntent[];
  tags: any[],
  onEditExampleClose: () => void;
  refetchOptions: any;
}) => {
  const classes = useStyles();
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const [intent, setIntent] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [addTag, setAddTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState<any[]>([]);
  const lastID = useRef(0);
  const { enqueueSnackbar } = useSnackbar();

  const updateTag = (e: ChangeEvent<{}>, tag: any) => setTag(tag?.value ?? '');

  const updateIntent = (e: ChangeEvent<{}>, intent: IIntent | null) => setIntent(intent?.value ?? '');

  const onExampleUpdate = (id: number) => (updatedExample: any) => {
    const index = examples.findIndex(ex => ex.id === id);
    const updatedExamples = Array.from([...examples]);
    const currentIntent = intents.find(int => int.value === intent);
    updatedExamples.splice(index, 1, {
      ...updatedExample,
      intentId: currentIntent?.id,
      intentName: currentIntent?.value,
    });

    setExamples([ ...updatedExamples ]);
  };

  const onAddExample = () => {
    const currentIntent = intents.find(int => int.value === intent);
    const currentExamples = Array.from([...examples]);
    setExamples([
      ...currentExamples,
      {
        id: lastID.current + 1,
        intentId: currentIntent?.id,
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

  const saveChanges = async () => {
    const currentIntent = intents.find(int => int.value === intent);
    if (intent === '' || !currentIntent) {
      enqueueSnackbar('Make sure you\'ve selected an intent before proceeding', { variant: 'warning' });
      return;
    }

    const hasNoEmptyExamples = examples.reduce((prev, curr) => prev && !!curr.text, true);

    if (!hasNoEmptyExamples) {
      enqueueSnackbar('Please make sure no example is empty before proceeding', { variant: 'error' });
      return;
    }

    try {
      setLoading(true);

      await createExamples({
        variables: {
          agentId: numAgentId,
          examples: examples.map(ex => ({
            text: ex.text,
            intentId: currentIntent.id,
            tags: ex.tags.map((tag: any) => ({
              start: tag.start,
              end: tag.end,
              tagTypeId: tag.tagType.id,
            })),
          })),
        },
        ...refetchOptions,
      });

      enqueueSnackbar('Examples created successfully', { variant: 'success' });

      onEditExampleClose();
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
          agentId: numAgentId ,
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
          <IconButton disabled={loading} edge="start" color="inherit" onClick={onEditExampleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Create Examples
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
      <Grid container={true}>
        <Grid item={true} xs={6}>
          <Box px={2} my={5}>
            <Autocomplete
              fullWidth={true}
              disabled={loading}
              disableClearable={true}
              id="intentSelector"
              options={intents}
              getOptionLabel={(option: any) => option.value}
              value={intents.find((i: any) => i.value === intent) ?? null as any}
              onChange={updateIntent}
              renderInput={(params) => <TextField {...params} label="Intents" variant="outlined" />}
            />
          </Box>
        </Grid>
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
                  <Button variant="contained" color="secondary" style={{ height: 52 }} onClick={() => setAddTag(true)}>Add New</Button>
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
    </Dialog>
  );
};

interface AddExampleItemProps {
  loading: boolean;
  error?: Maybe<ExamplesError>;
  tag: string;
  tags: any[];
  example: IExample;
  onExampleUpdate: (updatedExample: any) => void;
}

const AddExampleItem = ({ loading, error, tag, tags, example, onExampleUpdate }: AddExampleItemProps) => {
  const [
    exampleText,
    setExampleText,
    annotatorState,
    setAnnotatorState,
  ] = useEditExampleAnnotation({ tags, example });

  useEffect(() => {
    setAnnotatorState({
      ...annotatorState,
      tag,
    });
    // eslint-disable-next-line
  }, [tag]);

  useEffect(() => {
    onExampleUpdate({
      id: example?.id,
      agentId: example?.agentId,
      text: exampleText,
      tags: annotatorState.value?.map((tag: any) => ({
        start: tag.start,
        end: tag.end,
        tagType: {
          value: tag.tag,
          agentId: example?.agentId,
          id: tags.find((t: any) => t.value === tag.tag).id,
        },
      })) ?? [],
    });
    // eslint-disable-next-line
  }, [exampleText, annotatorState.value]);

  return (
    <Grid container={true}>
      <Grid item={true} xs={6}>
        <Box px={2}>
          <TextField
            disabled={loading}
            fullWidth={true}
            multiline={true}
            variant="outlined"
            rows={3}
            value={exampleText}
            onChange={e => setExampleText(e.target.value)}
            error={error === ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE}
          />
          <Typography variant="h6" color="error" style={{ fontWeight: 'bold', marginTop: 16 }}>
            {
              error === ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE ?
                'Cannot create duplicate example entry. Please try again with different values.' :
                null
            }
          </Typography>
        </Box>
      </Grid>
      <Grid item={true} xs={6}>
        <Box px={2}>
          <Box p={2} border="1px solid rgba(0, 0, 0, 0.23)" borderRadius={4}>
            <TextAnnotator
              style={{
                lineHeight: 1.5,
                pointerEvents: (loading || !tag || tags?.length === 0) ? 'none' : 'auto',
                minHeight: 60,
              }}
              content={exampleText}
              value={annotatorState.value}
              onChange={(value: any) => setAnnotatorState({ ...annotatorState, value })}
              getSpan={span => ({
                ...span,
                tag,
                color: 'rgb(132, 210, 255)',
              })}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AddExamples;
