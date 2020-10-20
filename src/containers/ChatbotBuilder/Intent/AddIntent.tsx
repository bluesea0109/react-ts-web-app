import { useMutation } from '@apollo/client';
import { AgentConfig, BaseAgentAction, IIntent } from '@bavard/agent-config';
import {
  Box,
  DialogContent,
  Divider,
  Grid,
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
import { Check, Close, Delete } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { Autocomplete } from '@material-ui/lab';
import gql from 'graphql-tag';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  CHATBOT_GET_AGENT,
  CHATBOT_SAVE_CONFIG_AND_SETTINGS,
} from '../../../common-gql-queries';
import { INLUExample } from '../../../models/chatbot-service';
import { currentAgentConfig, currentWidgetSettings } from '../atoms';
import { AddExampleItem } from '../Examples/AddExamples';
import { EXAMPLES_LIMIT } from '../Examples/Examples';
import { getExamplesQuery } from '../Examples/gql';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
      backgroundColor: '#2B2AC6',
    },
    title: {
      marginLeft: theme.spacing(2),
      color: 'white',
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

type AddIntentProps = {
  actions: BaseAgentAction[];
  onAddIntentClose: () => void;
  tags: string[];
};

const createExamplesMutation = gql`
  mutation($agentId: Int!, $examples: [ChatbotService_ExampleInput!]!) {
    ChatbotService_uploadExamples(agentId: $agentId, examples: $examples)
  }
`;

const AddIntent = ({ actions, onAddIntentClose }: AddIntentProps) => {
  const classes = useStyles();
  const [newIntent, setNewIntent] = useState<IIntent>({
    name: '',
    defaultActionName: undefined,
  });
  const { enqueueSnackbar } = useSnackbar();

  const [_config, setConfig] = useRecoilState<AgentConfig | undefined>(
    currentAgentConfig,
  );
  const config = _.cloneDeep(_config);
  const widgetSettings = useRecoilValue(currentWidgetSettings);

  const tagTypes = Array.from(config?.getTagTypes() ?? []);

  const { agentId } = useParams<{ agentId: string }>();
  const numAgentId = Number(agentId);
  const [tagType, setTagType] = useState<string | undefined>();
  const [addTag, setAddTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState<INLUExample[]>([]);
  const lastID = useRef(0);

  const [updateAgent] = useMutation(CHATBOT_SAVE_CONFIG_AND_SETTINGS, {
    refetchQueries: [
      { query: CHATBOT_GET_AGENT, variables: { agentId: Number(agentId) } },
    ],
    awaitRefetchQueries: true,
  });

  const [createExamples] = useMutation(createExamplesMutation);

  const updateTagType = (e: ChangeEvent<{}>, tagType: string | null) =>
    setTagType(tagType ?? '');

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const onExampleUpdate = (id: number) => (updatedExample: INLUExample) => {
    const index = examples.findIndex((ex) => ex.id === id);
    const updatedExamples = Array.from([...examples]);
    updatedExamples.splice(index, 1, {
      ...updatedExample,
      intent: '',
    });

    setExamples([...updatedExamples]);
  };

  const onAddExample = () => {
    const currentExamples = Array.from([...examples]);
    setExamples([
      ...currentExamples,
      {
        id: lastID.current + 1,
        agentId: numAgentId,
        intent: '',
        tags: [],
        text: '',
      },
    ]);

    lastID.current = lastID.current + 1;
  };

  const onDeleteExample = (id: number) => () => {
    const index = examples.findIndex((ex) => ex.id === id);
    const updatedExamples = Array.from([...examples]);
    updatedExamples.splice(index, 1);

    setExamples([...updatedExamples]);
  };

  const saveChanges = async () => {
    if (newIntent.name === '') {
      enqueueSnackbar('Intent can\'t be empty', { variant: 'warning' });
      return;
    }

    const hasNoEmptyExamples = examples.reduce(
      (prev, curr) => prev && !!curr.text,
      true,
    );

    if (!hasNoEmptyExamples) {
      enqueueSnackbar(
        'Please make sure no example is empty before proceeding',
        { variant: 'error' },
      );
      return;
    }

    try {
      setLoading(true);

      const { name, defaultActionName } = newIntent;
      config.addIntent(name, defaultActionName);
      setConfig(config);

      enqueueSnackbar('Intent created successfully', { variant: 'success' });

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

      if (examples.length > 0) {
        await createExamples({
          variables: {
            agentId: numAgentId,
            examples: examples.map((ex) => ({
              text: ex.text,
              intent: newIntent.name,
              tags: ex.tags.map((tag: any) => ({
                start: tag.start,
                end: tag.end,
                tagType: tag.tag,
              })),
            })),
          },
          refetchQueries: [
            {
              query: getExamplesQuery,
              variables: {
                agentId: Number(agentId),
                limit: EXAMPLES_LIMIT,
              },
            },
          ],
          awaitRefetchQueries: true,
        });

        enqueueSnackbar('Examples created successfully', {
          variant: 'success',
        });
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
          <Typography variant="h6" className={classes.title}>
            Create New Intent
          </Typography>
          {/* <Button disabled={loading} autoFocus={true} color="inherit" onClick={saveChanges}>
            {loading && (
              <CircularProgress
                color="secondary"
                size={20}
              />
            )}
            Create
          </Button> */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={onAddIntentClose}
            aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box my={4}>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <TextField
                  fullWidth={true}
                  label="Intent Value (No Spaces Allowed)"
                  variant="outlined"
                  value={newIntent.name}
                  onChange={(e) =>
                    setNewIntent({
                      ...newIntent,
                      name: e.target.value.replace(/ /g, '+'),
                    })
                  }
                />
              </Box>
            </Grid>
            <Grid item={true} xs={6}>
              <Box p={2}>
                <Autocomplete
                  fullWidth={true}
                  id="intentDefaultActionSelector"
                  options={actions}
                  getOptionLabel={(option: BaseAgentAction) => option.name}
                  value={actions.find(
                    (a) => a.name === newIntent?.defaultActionName,
                  )}
                  onChange={(e, action) =>
                    setNewIntent({
                      ...newIntent,
                      defaultActionName: action?.name,
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Default Action"
                      variant="outlined"
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
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
                        onChange={(e: any) =>
                          setNewTag(e.target.value.replace(/ /g, '_') as string)
                        }
                      />
                    </Grid>
                    <Grid item={true}>
                      <IconButton onClick={createTag}>
                        <Check />
                      </IconButton>
                    </Grid>
                    <Grid item={true}>
                      <IconButton
                        onClick={() => {
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
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Selected Tag Type"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item={true}>
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ height: 52 }}
                        onClick={() => setAddTag(true)}>
                        Add New
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Grid>
            {examples.map((example) => (
              <Grid key={example.id} item={true} xs={12}>
                <Divider variant="middle" />
                <Box p={4}>
                  <Grid container={true} alignItems="center" spacing={2}>
                    <Grid item={true}>
                      <Typography variant="h6">
                        Example #{example.id}
                      </Typography>
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
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={onAddExample}>
              Add New Item
            </Button>
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={saveChanges}>
              Save
            </Button>

          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddIntent;
