import { AgentConfig } from '@bavard/agent-config';
import {
  Button,
  Card,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import _ from 'lodash';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    inputBox: {
      margin: theme.spacing(1),
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

const NewTag: React.FC = () => {
  const classes = useStyles();
  const [tagName, setTagName] = useState<string>('');
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);

  if (!config) {
    return <Typography>Agent config is empty.</Typography>;
  }

  const onSubmit = () => {
    const newConfig = _.cloneDeep<AgentConfig>(config);
    newConfig.addTagType(tagName);
    setConfig(newConfig);

    setTagName('');
  };

  return (
    <Card className={clsx(classes.root)}>
      <Typography variant="h4">New Tag</Typography>
      <br />
      <TextField
        id="name"
        label="Tag Name"
        type="text"
        value={tagName}
        variant="outlined"
        onChange={(e: any) => setTagName(e.target.value as string)}
        className={clsx(classes.inputBox)}
      />
      <br />
      <Button
        className={clsx(classes.button)}
        variant="contained"
        color="primary"
        disabled={!tagName}
        onClick={onSubmit}>
        Submit
      </Button>
    </Card>
  );
};

export default NewTag;
