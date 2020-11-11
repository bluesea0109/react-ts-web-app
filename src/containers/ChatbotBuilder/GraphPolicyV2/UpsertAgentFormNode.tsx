import {
  AgentFormNode,
  GraphPolicyNode,
  IAgentFormNode,
} from '@bavard/agent-config/dist/graph-policy-v2';

import { EFormFieldTypes, IFormField } from '@bavard/agent-config/dist';

import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CancelOutlined } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { AddFieldForm } from '../GraphPolicy/AddActionField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      display: 'flex',
      marginBottom: theme.spacing(2),
    },
  }),
);

interface IUpsertAgentFormNodeProps {
  onSubmit?: (node: GraphPolicyNode) => void;
  nodeId: number;
  node?: IAgentFormNode;
}

export default function UpsertAgentFormNode({
  nodeId,
  node,
  onSubmit,
}: IUpsertAgentFormNodeProps) {
  const classes = useStyles();
  const [error, setError] = useState<string>();

  const [formFields, setFormFields] = useState<IFormField[]>(
    node?.fields || [],
  );

  const [url, setUrl] = useState(node?.url);

  const addFormField = (
    fieldName: string,
    fieldType: EFormFieldTypes,
    required: boolean = true,
  ) => {
    console.log('ADDING FORM FIELD: ', fieldName, fieldType, required);
    setFormFields([
      ...formFields,
      { name: fieldName, type: fieldType, required },
    ]);
  };

  const deleteField = (key: number) => {
    const result = formFields.filter((item, index) => key !== index && item);
    setFormFields(result);
  };

  const handleSubmit = () => {
    console.log({ formFields, url });

    if (!url) {
      return setError('Url is required');
    }

    const newNode = new AgentFormNode(nodeId, url, formFields);
    console.log('NEW NODE: ', newNode);
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

  const formContent = (
    <React.Fragment>
      <TextField
        name={'url'}
        label={'Url'}
        variant="outlined"
        className={classes.formControl}
        size="small"
        defaultValue={node?.url}
        onChange={(e) => setUrl(e.target.value as string)}
      />
      {formFields &&
        formFields.map((item: any, key: number) => (
          <FormControl
            key={key}
            variant="outlined"
            className={classes.formControl}>
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => deleteField(key)}>
                      <CancelOutlined />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name={item.name}
              label={`${item.name} [${item.type}]`}
              variant="outlined"
              size="small"
            />
          </FormControl>
        ))}
      <AddFieldForm handleChange={addFormField} />

      {renderSubmitButton(handleSubmit)}
    </React.Fragment>
  );

  return <div>{formContent}</div>;
}
