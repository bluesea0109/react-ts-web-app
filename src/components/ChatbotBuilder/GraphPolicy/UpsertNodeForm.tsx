import {
  EmailNode,
  FormNode,
  GraphPolicyNode,
  UtteranceNode,
} from '@bavard/agent-config/dist/graph-policy';
import {
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import React, { useEffect, useState } from 'react';
import { validateEmail } from '../../../utils/string';

import RichTextInput from '../../Utils/RichTextInput';
import { AddFieldForm } from '../GraphPolicy/AddActionField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
  }),
);

interface IUpsertNodeFormProps {
  onChange: (
    node: GraphPolicyNode | UtteranceNode | EmailNode | FormNode | undefined,
  ) => void;
  nodeId: number;
  node?: GraphPolicyNode | UtteranceNode | EmailNode | FormNode;
}

export default function UpsertNodeForm({
  nodeId,
  node,
  onChange,
}: IUpsertNodeFormProps) {
  const classes = useStyles();
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [utterance, setUtterance] = useState(node?.toJsonObj().utterance || '');
  const [nodeType, setNodeType] = useState<string>(
    node?.type || 'UtteranceNode',
  );
  const [fromEmail, setFromEmail] = useState(
    node instanceof EmailNode ? node.from : '',
  );
  const [toEmail, setToEmail] = useState(
    node instanceof EmailNode ? node.to : '',
  );

  const [formFields, setFormFields] = useState<object[]>([]);

  const [url, setURL] = useState(node instanceof FormNode ? node.url : '');

  console.log('Form node url ', node, 'URL : ', url);
  const [actionName, setActionName] = useState(node?.actionName || '');

  const handleUtteranceNode = async () => {
    if (node) {
      node.setActionName(actionName);
      node.setUtterance(utterance);
      onChange(node);
    } else {
      const newNode = new UtteranceNode(nodeId, actionName, utterance);

      onChange(newNode);
    }
  };

  const handleEmailNode = async () => {
    if (!validateEmail(fromEmail) || !validateEmail(toEmail)) {
      return;
    }

    if (node && node instanceof EmailNode) {
      node.setFromEmail(fromEmail);
      node.setToEmail(toEmail);
      node.setActionName(actionName);
      node.setUtterance(utterance);
      onChange(node);
    } else {
      const newNode = new EmailNode(
        nodeId,
        actionName,
        toEmail,
        fromEmail,
        utterance,
      );
      onChange(newNode);
    }
  };

  const handleChange = () => {
    setShowFormErrors(true);

    // Preliminary validation
    if (!utterance || !actionName || !nodeId) {
      return;
    }

    if (nodeType === UtteranceNode.typename) {
      handleUtteranceNode();
    } else if (nodeType === EmailNode.typename) {
      handleEmailNode();
    }
  };

  const addFormField = (fieldName: string, fieldType: string) => {
    setFormFields([...formFields, { fieldName, fieldType }]);
  };

  const deleteField = (key: number) => {
    const result = formFields.filter((item, index) => key !== index && item);
    setFormFields(result);
  };

  useEffect(handleChange, [fromEmail, toEmail, actionName, utterance]);

  return (
    <div>
      <FormControl className={classes.formControl} disabled={!!node}>
        <RadioGroup
          name="responseType"
          defaultValue={nodeType || UtteranceNode.typename}
          onChange={(event) => {
            setNodeType(event.target.value);
          }}>
          <FormControlLabel
            value={UtteranceNode.typename}
            control={<Radio />}
            label="Utterance Node"
          />
          <FormControlLabel
            value={EmailNode.typename}
            control={<Radio />}
            label="Email Node"
          />
          <FormControlLabel
            value={FormNode.typename}
            control={<Radio />}
            label="Form Node"
          />
        </RadioGroup>
      </FormControl>
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField
          name="actionName"
          error={showFormErrors && actionName === ''}
          defaultValue={actionName}
          required={true}
          label="Action Name"
          variant="outlined"
          onChange={(e) => setActionName(e.target.value as string)}
        />
      </FormControl>
      {nodeType === EmailNode.typename && (
        <React.Fragment>
          <FormControl variant="outlined" className={classes.formControl}>
            <TextField
              name="fromEmail"
              error={showFormErrors && !validateEmail(fromEmail)}
              defaultValue={fromEmail}
              required={true}
              label="From Email"
              variant="outlined"
              onChange={(e) => setFromEmail(e.target.value as string)}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <TextField
              name="toEmail"
              error={showFormErrors && !validateEmail(toEmail)}
              defaultValue={toEmail}
              required={true}
              label="To Email"
              variant="outlined"
              onChange={(e) => setToEmail(e.target.value as string)}
            />
          </FormControl>
        </React.Fragment>
      )}
      {nodeType === FormNode.typename && (
        <React.Fragment>
          <FormControl variant="outlined" className={classes.formControl}>
            <TextField
              name="url"
              error={showFormErrors && !url.length}
              defaultValue={url}
              required={true}
              label="URL"
              variant="outlined"
              onChange={(e) => setURL(e.target.value as string)}
            />
          </FormControl>

          {formFields &&
            formFields.map((item: any, key: number) => (
              <Grid container={true} key={key}>
                <Grid xs={11}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}>
                    <TextField
                      name={item.fieldName}
                      label={`${item.fieldName} [${item.fieldType}]`}
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid xs={1}>
                  <IconButton onClick={() => deleteField(key)}>
                    <CancelOutlinedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          <AddFieldForm handleChange={addFormField} />
        </React.Fragment>
      )}
      {nodeType !== FormNode.typename && (
        <FormControl variant="outlined" className={classes.formControl}>
          <RichTextInput
            label="Utterance"
            value={utterance}
            onChange={(value: string) => setUtterance(value)}
          />
        </FormControl>
      )}
    </div>
  );
}
