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

import { ENodeActor } from './types';

import { Button, FormControl, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { validateEmail, validateUrl } from '../../../utils/string';
import RichTextInput from '../../../components/RichTextInput';
import UpsertAgentFormNode from './UpsertAgentFormNode';
import UpsertUserImageOption from './UpsertUserImageOption';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      display: 'flex',
      marginBottom: theme.spacing(2),
    },
  })
);

interface IUpsertNodeFormProps {
  onChange: (node: GraphPolicyNode) => void;
  onSubmit?: (node: GraphPolicyNode) => void;
  nodeId: number;
  node?: IGraphPolicyNode;
  type: EUserNodeTypes | EAgentNodeTypes;
  actor: ENodeActor;
}

export default function UpsertNodeForm({
  nodeId,
  node,
  type,
  onSubmit,
  onChange,
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
    console.log('FORM FIELDS: ', formData);
  };

  const submitAgentUtterance = () => {
    if (!formData.utterance) {
      return setError('Utterance is required');
    }

    const newNode = new AgentUtteranceNode(
      nodeId,
      formData.utterance as string
    );

    onSubmit?.(newNode);
  };

  const submitAgentEmail = () => {
    const { prompt, to, from } = formData;
    if (!from || !to || !prompt) {
      return setError('Prompt, from, and to are all required fields');
    }

    if (!validateEmail(from)) {
      return setError('From email is invalid');
    }

    if (!validateEmail(to)) {
      return setError('To email is invalid');
    }

    const newNode = new AgentEmailNode(nodeId, prompt, to, from);

    console.log(newNode);

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

    console.log(text, targetLink, intent);

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
      <Button
        className={classes.formControl}
        onClick={submitFunc}
        variant="contained"
        color="primary">
        Submit
      </Button>
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
        from: editingNode?.from,
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
          <TextField
            className={classes.formControl}
            size="small"
            name="to"
            defaultValue={editingNode?.to}
            required={true}
            label="To"
            variant="outlined"
            onChange={(e) => setFormField('to', e.target.value as string)}
          />
          <TextField
            className={classes.formControl}
            name="from"
            size="small"
            defaultValue={editingNode?.from}
            required={true}
            label="From"
            variant="outlined"
            onChange={(e) => setFormField('from', e.target.value as string)}
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
          <TextField
            className={classes.formControl}
            size="small"
            name="targetLink"
            defaultValue={editingNode?.targetLink}
            required={true}
            label="Target Link"
            variant="outlined"
            onChange={(e) =>
              setFormField('targetLink', e.target.value as string)
            }
          />
          <TextField
            className={classes.formControl}
            name="intent"
            size="small"
            defaultValue={editingNode?.intent}
            required={true}
            label="Intent"
            variant="outlined"
            onChange={(e) => setFormField('intent', e.target.value as string)}
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

  console.log('INITIAL FORM DATA: ', initialFormData);

  const [formData, setFormData] = useState<any>(initialFormData);

  console.log('NODE: ', node);

  return <div>{formContent}</div>;
}
