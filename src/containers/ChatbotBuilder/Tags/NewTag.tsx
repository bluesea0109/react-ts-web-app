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
import React, { useState } from 'react';

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

interface NewTagProps {
  onAdd: (tag: string) => void;
}

const NewTag: React.FC<NewTagProps> = ({ onAdd }: NewTagProps) => {
  const classes = useStyles();
  const [tagName, setTagName] = useState<string>('');

  const onSubmit = () => {
    onAdd(tagName);
    setTagName('');
  };

  return (
    <Card className={clsx(classes.root)}>      
      <TextField
        id="name"
        label="Tag Name"
        type="text"
        value={tagName}
        variant="outlined"
        onChange={(e: any) => setTagName(e.target.value as string)}
        className={clsx(classes.inputBox)}
      />
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
