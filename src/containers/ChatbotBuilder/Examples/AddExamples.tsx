import { useMutation } from '@apollo/client';
import { cloneDeep } from '@apollo/client/utilities';
import { Box, Button, CircularProgress, Divider, Grid, LinearProgress, TextField } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
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
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { TextAnnotator } from 'react-text-annotate';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CHATBOT_GET_AGENT, CHATBOT_SAVE_CONFIG_AND_SETTINGS } from '../../../common-gql-queries';
import { INLUExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { currentAgentConfig, currentWidgetSettings } from '../atoms';
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
   onEditExampleClose,
   refetchOptions,
}: {
  onEditExampleClose: () => void;
  refetchOptions: any;
}) => {
  const [_config, setConfig] = useRecoilState(currentAgentConfig);
  const config = cloneDeep(_config);
  const widgetSettings = useRecoilValue(currentWidgetSettings);

  const intents = Array.from(config?.getIntents().map(x => x.name) ?? []);
  const tagTypes = Array.from(config?.getTagTypes() ?? []);

  const classes = useStyles();
  const { agentId } = useParams<{ agentId: string }>();
  const numAgentId = Number(agentId);
  const [intent, setIntent] = useState<string | undefined>();
  const [tagType, setTagType] = useState<string | undefined>();
  const [addTag, setAddTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState<INLUExample[]>([]);
  const lastID = useRef(0);
  const { enqueueSnackbar } = useSnackbar();

  const [updateAgent] = useMutation(
    CHATBOT_SAVE_CONFIG_AND_SETTINGS,
    {
      refetchQueries: [
        { query: CHATBOT_GET_AGENT, variables: { agentId: Number(agentId) } },
      ],
      awaitRefetchQueries: true,
    },
  );

  const updateTagType = (e: ChangeEvent<{}>, tagType: string | null) => setTagType(tagType ?? '');
  const updateIntent = (e: ChangeEvent<{}>, intent: string | null) => setIntent(intent ?? '');

  const onExampleUpdate = (id: number) => (updatedExample: INLUExample) => {
    const index = examples.findIndex(ex => ex.id === id);
    const updatedExamples = Array.from([...examples]);
    const currentIntent = intent;
    updatedExamples.splice(index, 1, {
      ...updatedExample,
      intent: currentIntent ?? '',
    });

    setExamples([ ...updatedExamples ]);
  };

  const onAddExample = () => {
    const currentExamples = Array.from([...examples]);
    setExamples([
      ...currentExamples,
      {
        id: lastID.current + 1,
        agentId: numAgentId,
        intent: intent ?? '',
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

  const saveChanges = async () => {
    if (intent === '') {
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

      if (!!config) {
        await updateAgent({
          variables: {
            agentId: Number(agentId),
            config: config.toJsonObj(),
            uname: config?.toJsonObj().uname,
            settings: widgetSettings,
          },
        });
      }

      await createExamples({
        variables: {
          agentId: numAgentId,
          examples: examples.map(ex => ({
            text: ex.text,
            intent,
            tags: ex.tags.map((tag: any) => ({
              start: tag.start,
              end: tag.end,
              tagType: tag.tag,
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
      setConfig(config?.addTagType(newTag));
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
              value={intent}
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
                    id="tagTypeSelector"
                    options={tagTypes}
                    value={tagType}
                    onChange={updateTagType}
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
              tagType={tagType ?? ''}
              tagTypes={tagTypes}
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
  tagType: string;
  tagTypes: string[];
  example: INLUExample;
  onExampleUpdate: (updatedExample: INLUExample) => void;
}

export const AddExampleItem = ({ loading, error, tagType, tagTypes, example, onExampleUpdate }: AddExampleItemProps) => {
  const [
    exampleText,
    setExampleText,
    annotatorState,
    setAnnotatorState,
    colors,
  ] = useEditExampleAnnotation({ tagTypes });

  useEffect(() => {
    setAnnotatorState({
      ...annotatorState,
      tagType,
    });
    // eslint-disable-next-line
  }, [tagType]);

  useEffect(() => {
    onExampleUpdate({
      id: example?.id,
      agentId: example?.agentId,
      intent: '',
      text: exampleText,
      tags: annotatorState.tags.map(tag => ({ ...tag, tagType: tag.tag })) ?? [],
    });
    // eslint-disable-next-line
  }, [exampleText, annotatorState.tags]);

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
                pointerEvents: (loading || !tagType || tagTypes?.length === 0) ? 'none' : 'auto',
                minHeight: 60,
              }}
              content={exampleText}
              value={annotatorState.tags}
              onChange={(value: any) => setAnnotatorState({ ...annotatorState, tags: value })}
              getSpan={span => ({
                ...span,
                tag: tagType,
                color: colors.current[tagType],
              })}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AddExamples;
