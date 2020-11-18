import { useMutation } from '@apollo/client';
import { AgentConfig, BaseAgentAction, IIntent } from '@bavard/agent-config';
import { DialogContent, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AddCircleOutline } from '@material-ui/icons';

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
import { FullDialog } from '../../../components';
import { INLUExample } from '../../../models/chatbot-service';
import { currentAgentConfig, currentWidgetSettings } from '../atoms';

import { EXAMPLES_LIMIT } from '../Examples/Examples';
import { getExamplesQuery } from '../Examples/gql';
import EditIntentForm from './EditIntentForm';
import { ExampleForm } from '../Examples';

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
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
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
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState<INLUExample[]>([]);
  const lastID = useRef(0);

  const [updateAgent] = useMutation(CHATBOT_SAVE_CONFIG_AND_SETTINGS, {
    refetchQueries: [{ query: CHATBOT_GET_AGENT, variables: { agentId } }],
    awaitRefetchQueries: true,
  });

  const [createExamples] = useMutation(createExamplesMutation);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const onExampleUpdate = (index: number, updatedExample: INLUExample) => {
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

  const handleActionFieldChange = (field: string) => {
    setNewIntent({
      ...newIntent,
      defaultActionName: field,
    });
  };

  return (
    <FullDialog
      isOpen={true}
      title="Create New Intent"
      onEditClose={onAddIntentClose}>
      <DialogContent>
        <Grid container={true} justify="center">
          <Grid item={true} sm={4} xs={8}>
            <EditIntentForm
              actions={actions}
              currentIntent={newIntent}
              onUpdateIntent={setNewIntent}
            />

            {(examples || []).map((example, index) => (
              <ExampleForm
                key={index}
                loading={loading}
                example={example}
                // tagType={tagType ?? ''}
                intent={newIntent}
                tagTypes={tagTypes}
                onSaveChanges={() => {}}
                onExampleUpdate={(example: INLUExample) =>
                  onExampleUpdate(index, example)
                }
              />
            ))}

            <Grid item={true} xs={12} className={classes.fields}>
              <Button
                color="primary"
                onClick={handleAddExample}
                endIcon={<AddCircleOutline />}>
                Add a New Example
              </Button>
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
