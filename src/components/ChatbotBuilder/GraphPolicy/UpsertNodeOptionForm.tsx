import {
  GraphPolicy,
  ResponseOption,
  HyperlinkOption,
} from '@bavard/graph-policy';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  Paper,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    optionImage: {
      width: 100,
      height: 100,
      borderRadius: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
    },
    nodePaper: {
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.spacing(1),
      padding: theme.spacing(2),
    },
  })
);

interface IUpsertNodeOptionFormProps {
  option?: ResponseOption;
  optionIndex?: number;
  nodeId: number;
  onSuccess: (policy: GraphPolicy) => void;
  policy: GraphPolicy;
}

export default function UpsertNodeOptionForm({
  option,
  optionIndex,
  nodeId,
  policy,
  onSuccess,
}: IUpsertNodeOptionFormProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const node = policy.getNodeById(nodeId);

  const [showFormErrors, setShowFormErrors] = useState(false);

  const [optionType, setOptionType] = useState<string>('HYPERLINK');
  const [text, setText] = useState<string>(
    option instanceof HyperlinkOption ? option.text : ''
  );
  const [targetLink, setTargetLink] = useState<string>(
    option instanceof HyperlinkOption ? option.targetLink : ''
  );

  const handleSubmit = async () => {
    setShowFormErrors(true);

    if (!text || !targetLink) {
      return;
    }

    if (Number.isInteger(optionIndex)) {
      node?.removeOptionAtIndex(optionIndex as number);
    }

    node?.addHyperlinkOption(text, targetLink);

    enqueueSnackbar('Option added', { variant: 'success' });
    clearForm();
    const newPolicy = new GraphPolicy(policy.rootNode);
    onSuccess(newPolicy);
  };

  const clearForm = () => {
    setText('');
    setTargetLink('');
    setOptionType('HYPERLINK');
  };

  const renderHyperlinkOptionFields = () => {
    return (
      <React.Fragment>
        <FormControl
          component="fieldset"
          className={classes.formControl}
          required={true}
          error={showFormErrors && !optionType}>
          <FormLabel>Option Type {optionType}</FormLabel>
          <RadioGroup
            name="responseType"
            defaultValue={optionType}
            onChange={(event) => {
              setOptionType(event.target.value);
            }}>
            <FormControlLabel
              value={'HYPERLINK'}
              control={<Radio />}
              label="Hyperlink"
            />
          </RadioGroup>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            name="text"
            label="Text"
            variant="outlined"
            required={true}
            error={showFormErrors && text === ''}
            defaultValue={text}
            onChange={(e) => setText(e.target.value as string)}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <TextField
            name="targetLink"
            label={'Target Link'}
            variant="outlined"
            required={true}
            error={showFormErrors && targetLink === ''}
            onChange={(e) => setTargetLink(e.target.value as string)}
            defaultValue={targetLink}
          />
        </FormControl>
      </React.Fragment>
    );
  };

  return (
    <Paper className={classes.nodePaper}>
      {optionType === 'HYPERLINK' && renderHyperlinkOptionFields()}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={handleSubmit}>
        {option ? 'Update Option' : 'Add Option'}
      </Button>
    </Paper>
  );
}
