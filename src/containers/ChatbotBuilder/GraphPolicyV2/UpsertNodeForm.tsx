import {
  EAgentNodeTypes,
  EUserNodeTypes,
} from '@bavard/agent-config/dist/graph-policy-v2/nodes';

import {
  AgentEmailNode,
  AgentUtteranceNode,
  GraphPolicyNode,
  IAgentEmailNode,
  IAgentFormNode,
  IAgentUtteranceNode,
  IGraphPolicyNode,
  IUserImageOptionNode,
  UserSubmitNode,
  UserTextOptionNode,
} from '@bavard/agent-config/dist/graph-policy-v2';

import { RichTextInput, TextInput, Button } from '@bavard/react-components';

import clsx from 'clsx';
import { ENodeActor } from './types';

import { FormControl, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Alert, Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { validateEmail, validateUrl } from '../../../utils/string';
import UpsertAgentFormNode from './UpsertAgentFormNode';
import UpsertUserImageOption from './UpsertUserImageOption';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      display: 'flex',
      marginBottom: theme.spacing(2),
    },
    submitButton: {
      float: 'right',
    },
    deleteButton: {
      float: 'left',
    },
  }),
);

interface IUpsertNodeFormProps {
  onSubmit?: (node: GraphPolicyNode) => void;
  onDelete?: () => void;
  nodeId: number;
  node?: IGraphPolicyNode;
  type: EUserNodeTypes | EAgentNodeTypes;
  actor: ENodeActor;
  intents?: string[];
}

export default function UpsertNodeForm({
  nodeId,
  node,
  type,
  onSubmit,
  onDelete,
  intents,
}: IUpsertNodeFormProps) {
  const classes = useStyles();

  const [error, setError] = useState<string>();

  let initialFormData: any = {};

  useEffect(() => {}, [node]);

  const setFormField = (field: string, value: any) => {
    setError(undefined);
    const oldFields = formData;
    oldFields[field] = value;
    setFormData(formData);
  };

  const submitAgentUtterance = () => {
    if (!formData.utterance) {
      return setError('Utterance is required');
    }

    const newNode = new AgentUtteranceNode(
      nodeId,
      formData.utterance as string,
    );

    onSubmit?.(newNode);
  };

  const submitAgentEmail = () => {
    const { prompt, to } = formData;
    if (!to || !prompt) {
      return setError('Prompt and to are all required fields');
    }

    if (!validateEmail(to)) {
      return setError('To email is invalid');
    }

    const newNode = new AgentEmailNode(nodeId, prompt, to);

    onSubmit?.(newNode);
  };

  const submitUserText = () => {
    const { text, targetLink, intent } = formData;
    if (!text) {
      return setError('Text is required');
    }

    if (targetLink && !validateUrl(targetLink)) {
      return setError('Target Link is an invalid url');
    }

    const newNode = new UserTextOptionNode(nodeId, text, targetLink, intent);

    onSubmit?.(newNode);
  };

  const submitUserSubmit = () => {
    const newNode = new UserSubmitNode(nodeId);

    onSubmit?.(newNode);
  };

  const renderSubmitButton = (submitFunc: () => void) => (
    <React.Fragment>
      {error && (
        <Alert className={classes.formControl} severity="error">
          {error}
        </Alert>
      )}

      {onDelete && (
        <Button
          title="Delete"
          className={clsx([classes.formControl, classes.deleteButton])}
          variant="outlined"
          color="secondary"
          onClick={() => onDelete?.()}
        />
      )}

      <Button
        title="Submit"
        className={clsx([classes.formControl, classes.submitButton])}
        onClick={submitFunc}
        variant="contained"
        color="primary"
      />
    </React.Fragment>
  );

  let formContent = <></>;
  switch (type) {
    case EAgentNodeTypes.AGENT_UTTERANCE: {
      const editingNode = node as IAgentUtteranceNode;
      initialFormData = {
        utterance: editingNode?.utterance,
      };

      formContent = (
        <React.Fragment>
          <FormControl variant="outlined" className={classes.formControl}>
            <RichTextInput
              label="Utterance"
              value={editingNode?.utterance}
              onChange={(value: string) => setFormField('utterance', value)}
            />
          </FormControl>
          {renderSubmitButton(submitAgentUtterance)}
        </React.Fragment>
      );
      break;
    }
    case EAgentNodeTypes.AGENT_EMAIL: {
      const editingNode = node as IAgentEmailNode;

      initialFormData = {
        prompt: editingNode?.prompt,
        to: editingNode?.to,
      };

      formContent = (
        <React.Fragment>
          <FormControl className={classes.formControl}>
            <RichTextInput
              label="Prompt"
              value={editingNode?.prompt}
              onChange={(value: string) => setFormField('prompt', value)}
            />
          </FormControl>
          <TextInput
            name="to"
            defaultValue={editingNode?.to}
            required={true}
            label="To"
            labelType="Typography"
            labelPosition="top"
            variant="outlined"
            className={classes.formControl}
            onChange={(e) => setFormField('to', e.target.value as string)}
          />
          {renderSubmitButton(submitAgentEmail)}
        </React.Fragment>
      );
      break;
    }
    case EAgentNodeTypes.AGENT_FORM: {
      formContent = (
        <UpsertAgentFormNode
          nodeId={nodeId}
          node={node as IAgentFormNode}
          onSubmit={onSubmit}
        />
      );
      break;
    }

    case EUserNodeTypes.USER_IMAGE_OPTION: {
      formContent = (
        <UpsertUserImageOption
          nodeId={nodeId}
          node={node as IUserImageOptionNode}
          onSubmit={onSubmit}
          intents={intents}
        />
      );

      break;
    }
    case EUserNodeTypes.USER_TEXT_OPTION: {
      const editingNode = node as UserTextOptionNode;
      initialFormData = {
        text: editingNode?.text,
        targetLink: editingNode?.targetLink,
        intent: editingNode?.intent,
      };

      formContent = (
        <React.Fragment>
          <FormControl className={classes.formControl}>
            <RichTextInput
              label="Text"
              value={editingNode?.text}
              onChange={(value: string) => setFormField('text', value)}
            />
          </FormControl>
          <TextInput
            name="targetLink"
            defaultValue={editingNode?.targetLink}
            label="Target Link"
            labelType="Typography"
            labelPosition="top"
            variant="outlined"
            className={classes.formControl}
            onChange={(e) =>
              setFormField('targetLink', e.target.value as string)
            }
          />

          <Autocomplete
            freeSolo={true}
            defaultValue={editingNode?.intent}
            className={classes.formControl}
            options={(intents || []).map((option) => option)}
            renderInput={(params) => (
              <TextInput
                {...params}
                label="Intent"
                labelType="Typography"
                labelPosition="top"
                variant="outlined"
                onChange={(e) =>
                  setFormField('intent', e.target.value as string)
                }
              />
            )}
          />

          {renderSubmitButton(submitUserText)}
        </React.Fragment>
      );
      break;
    }
    case EUserNodeTypes.USER_SUBMIT: {
      formContent = (
        <React.Fragment>
          <Typography variant="subtitle2" className={classes.formControl}>
            User Submit Node
          </Typography>
          {renderSubmitButton(submitUserSubmit)}
        </React.Fragment>
      );
      break;
    }
  }

  const [formData, setFormData] = useState<any>(initialFormData);

  return <div>{formContent}</div>;
}
