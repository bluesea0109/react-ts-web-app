import { useMutation } from '@apollo/client';
import { AgentConfig, BaseAgentAction, IIntent } from '@bavard/agent-config';
import { DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { AddCircleOutline } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';

import gql from 'graphql-tag';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  CHATBOT_GET_AGENT,
  CHATBOT_SAVE_CONFIG_AND_SETTINGS,
} from '../../../common-gql-queries';
import { UpTransition } from '../../../components';
import { DropDown } from '../../../components';
import { INLUExample } from '../../../models/chatbot-service';
import { currentAgentConfig, currentWidgetSettings } from '../atoms';
import AddExampleItem from '../Examples/AddExamples';

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
    fields: {
      marginBottom: '40px',
    },
    intent: {
      padding: '7px',
      fontSize: '16px',
    },
    instruction: {
      marginTop: '50px',
      marginBottom: '30px',
      fontSize: '18px',
    },
    fieldLabel: {
      marginBottom: '5px',
      fontSize: '18px',
      fontWeight: 'bold',
    },
    addExampleBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    addIntentBtn: {
      display: 'flex',
      justifyContent: 'center',
    },
    tagDialog: {
      padding: '125px',
    },
  }),
);

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

  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);
  const [tagType, setTagType] = useState<string | undefined>();
  const [addTag, setAddTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState<INLUExample[]>([]);
  const lastID = useRef(0);

  const [updateAgent] = useMutation(CHATBOT_SAVE_CONFIG_AND_SETTINGS, {
    refetchQueries: [{ query: CHATBOT_GET_AGENT, variables: { agentId } }],
    awaitRefetchQueries: true,
  });

  const [createExamples] = useMutation(createExamplesMutation);

  // const updateTagType = (e: ChangeEvent<{}>, tagType: string | null) =>
  //   setTagType(tagType ?? '');

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

  const handleAddExample = () => {
    setExamples([
      ...examples,
      {
        id: lastID.current + 1,
        agentId,
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
      enqueueSnackbar("Intent can't be empty", { variant: 'warning' });
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

      if (config) {
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
            agentId,
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
      enqueueSnackbar("Can't create empty tag", { variant: 'error' });
      return;
    }
    // tags: Array(0);
    try {
      setLoading(true);
      setConfig(config?.addTagType(newTag));
      setNewTag('');
      setAddTag(false);
    } catch (e) {
      enqueueSnackbar('Unable to create tag.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleActionFieldChange = (field: string) => {
    setNewIntent({
      ...newIntent,
      defaultActionName: field,
    });
  };

  const handleTagTypeChange = (field: string) => {
    setTagType(field);
  };

  return (
    <Dialog fullScreen={true} open={true} TransitionComponent={UpTransition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Create New Intent
          </Typography>
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
        <Grid container={true}>
          <Grid item={true} md={4} xs={12} />
          <Grid item={true} md={4} xs={12}>
            <Typography className={classes.instruction}>
              Add an Intent to customize your Assistant’s behavior:
            </Typography>
          </Grid>
          <Grid item={true} md={4} xs={12} />
        </Grid>
        <Grid container={true} className={classes.fields}>
          <Grid item={true} md={4} xs={12} />
          <Grid item={true} md={4} xs={12}>
            <Typography className={classes.fieldLabel}>Intent Value</Typography>
            <TextField
              fullWidth={true}
              variant="outlined"
              value={newIntent.name}
              onChange={(e) =>
                setNewIntent({
                  ...newIntent,
                  name: e.target.value.replace(/ /g, '+'),
                })
              }
              inputProps={{ className: classes.intent }}
            />
          </Grid>
          <Grid item={true} xs={4} md={12} />
        </Grid>
        <Grid container={true} className={classes.fields}>
          <Grid item={true} md={4} xs={12} />
          <Grid item={true} md={4} xs={12}>
            <Typography className={classes.fieldLabel}>
              Default Action
            </Typography>
            <DropDown
              label=""
              fullWidth={true}
              current={actions.find(
                (a) => a.name === newIntent?.defaultActionName,
              )}
              menuItems={actions}
              onChange={handleActionFieldChange}
            />
          </Grid>
          <Grid item={true} xs={4} md={12} />
        </Grid>

        <Grid container={true} className={classes.fields}>
          <Grid item={true} md={4} xs={12} />
          <Grid item={true} md={4} xs={12}>
            <Typography className={classes.fieldLabel}>
              Select Tag Type
            </Typography>
            <DropDown
              fullWidth={true}
              label=""
              current={tagType}
              menuItems={tagTypes}
              onChange={handleTagTypeChange}
            />
          </Grid>
          <Grid item={true} xs={4} md={12} />
        </Grid>
        {tagType && (
          <Grid container={true}>
            <Grid item={true} md={4} xs={12} />
            <Grid item={true} md={4} xs={12} className={classes.addExampleBtn}>
              <Button
                color="primary"
                onClick={() => setAddTag(true)}
                endIcon={<AddCircleOutline />}>
                Add a New TagType
              </Button>
            </Grid>
            <Grid item={true} md={4} xs={12} />
          </Grid>
        )}
        <Grid container={true}>
          <Grid item={true} md={4} xs={12} />
          <Grid item={true} md={4} xs={12}>
            {examples &&
              examples.map((example, index) => (
                <AddExampleItem
                  key={index}
                  loading={loading}
                  example={example}
                  tagType={tagType ?? ''}
                  tagTypes={tagTypes}
                  onExampleUpdate={onExampleUpdate(example.id)}
                  onDeleteExample={onDeleteExample(example.id)}
                />
              ))}
          </Grid>
          <Grid item={true} md={4} xs={12} />
        </Grid>
        <Grid container={true}>
          <Grid item={true} md={4} xs={12} />
          <Grid item={true} md={4} xs={12} className={classes.addExampleBtn}>
            <Button
              color="primary"
              onClick={handleAddExample}
              endIcon={<AddCircleOutline />}>
              Add a New Example
            </Button>
          </Grid>
          <Grid item={true} md={4} xs={12} />
        </Grid>
        <Grid container={true}>
          <Grid item={true} md={4} xs={12} />
          <Grid item={true} md={4} xs={12} className={classes.addIntentBtn}>
            <Button color="primary" variant="contained" onClick={saveChanges}>
              Add Intent
            </Button>
          </Grid>
          <Grid item={true} md={4} xs={12} />
        </Grid>
        {addTag && (
          <Dialog
            title="Create a Project"
            open={true}
            onClose={() => setAddTag(false)}
            className={classes.tagDialog}>
            <DialogTitle>Please add tag name</DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
              <Grid
                container={true}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '15px',
                }}>
                <Button
                  onClick={createTag}
                  color="primary"
                  variant="contained"
                  style={{ marginRight: '10px' }}>
                  Save
                </Button>
                <Button onClick={() => setAddTag(false)} variant="contained">
                  Cancel
                </Button>
              </Grid>
            </DialogActions>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddIntent;
