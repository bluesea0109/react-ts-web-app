import { useMutation } from '@apollo/client';
import { AgentConfig, BaseAgentAction, IIntent } from '@bavard/agent-config';
import { FullDialog, IconButton } from '@bavard/react-components';
import { DialogContent, Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AddCircleOutline } from '@material-ui/icons';

import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';

import EditIntentForm from './EditIntentForm';
import { currentAgentConfig, currentWidgetSettings } from '../atoms';
import { INLUExample } from '../../../models/chatbot-service';
import { ExampleForm } from '../Examples';

import {
  EXAMPLES_LIMIT,
  getExamplesQuery,
  createExamplesMutation,
} from '../Examples';
import {
  CHATBOT_GET_AGENT,
  CHATBOT_SAVE_CONFIG_AND_SETTINGS,
} from '../../../common-gql-queries';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fields: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }),
);

type AddIntentProps = {
  actions: BaseAgentAction[];
  onAddIntentClose: () => void;
  tags: string[];
};

const AddIntent = ({ actions, onAddIntentClose }: AddIntentProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);

  const [newIntent, setNewIntent] = useState<IIntent>({
    name: '',
    defaultActionName: undefined,
  });
  const { enqueueSnackbar } = useSnackbar();

  const widgetSettings = useRecoilValue(currentWidgetSettings);
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(
    currentAgentConfig,
  );
  const tagTypes = Array.from(config?.getTagTypes() ?? []);

  const lastID = useRef(1);
  const [examples, setExamples] = useState<INLUExample[]>([
    {
      id: 1,
      agentId,
      intent: '',
      tags: [],
      text: '',
    },
  ]);

  const [updateAgent] = useMutation(CHATBOT_SAVE_CONFIG_AND_SETTINGS, {
    refetchQueries: [{ query: CHATBOT_GET_AGENT, variables: { agentId } }],
    awaitRefetchQueries: true,
  });

  const [createExamples] = useMutation(createExamplesMutation);

  if (!config) {
    return null;
  }

  const onExampleUpdate = (updatedExample: INLUExample) => {
    const index = examples.findIndex(
      (example) => updatedExample.id === example.id,
    );

    setExamples([
      ...examples.slice(0, index),
      updatedExample,
      ...examples.slice(index + 1),
    ]);
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

  const onDeleteExample = (id: number) => {
    setExamples([...examples.filter((example) => example.id !== id)]);
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
      const newConfig = config.copy().addIntent(name, defaultActionName);
      setConfig(newConfig);

      enqueueSnackbar('Intent created successfully', { variant: 'success' });

      if (newConfig) {
        await updateAgent({
          variables: {
            agentId: Number(agentId),
            config: newConfig.toJsonObj(),
            uname: newConfig?.toJsonObj().uname,
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
                tagType: tag.tag || tag.tagType,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullDialog
      isOpen={true}
      title="Create New Intent"
      onClose={onAddIntentClose}>
      <DialogContent>
        <Grid container={true} justify="center">
          <Grid item={true} sm={4} xs={8}>
            <EditIntentForm
              actions={actions}
              currentIntent={newIntent}
              onUpdateIntent={setNewIntent}
            />

            <Grid
              container={true}
              item={true}
              xs={12}
              justify="center"
              className={classes.fields}>
              <Typography variant="subtitle1">
                {
                  "Edit or add an example in natural language below to improve your Assistant's detection of the user's input."
                }
              </Typography>
            </Grid>
            {(examples || []).map((example) => (
              <Grid
                key={example.id}
                container={true}
                item={true}
                xs={12}
                justify="center"
                className={classes.fields}>
                <ExampleForm
                  loading={loading}
                  example={example}
                  intent={newIntent}
                  tagTypes={tagTypes}
                  onDelete={() => onDeleteExample(example.id)}
                  onSaveChanges={() => {}}
                  onExampleUpdate={onExampleUpdate}
                />
              </Grid>
            ))}

            <Grid item={true} xs={12} className={classes.fields}>
              <IconButton
                title="Add a New Example"
                variant="text"
                iconPosition="left"
                Icon={AddCircleOutline}
                onClick={handleAddExample}
              />
            </Grid>

            <Grid item={true} md={4} xs={12} className={classes.fields}>
              <Button color="primary" variant="contained" onClick={saveChanges}>
                Add Intent
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </FullDialog>
  );
};

export default AddIntent;
