import { BasicButton, TextInput } from '@bavard/react-components';
import {
  Box,
  Card,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    textInput: {
      marginBottom: theme.spacing(1),

      '& .MuiOutlinedInput-input': {
        padding: '9px 12px',
      },
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
    <Card className={classes.root}>
      <Box
        width={300}
        display="flex"
        flexDirection="column"
        justifyContent="stretch">
        <Typography variant="h5">Create a New Tag Type</Typography>
        <TextInput
          id="name"
          label="Tag Type Name"
          labelType="Typography"
          labelPosition="top"
          value={tagName}
          variant="outlined"
          fullWidth={true}
          onChange={(e: any) => setTagName(e.target.value as string)}
          className={classes.textInput}
        />
        <BasicButton
          title="Create Tag"
          textTransform="none"
          disabled={!tagName}
          onClick={onSubmit}
        />
      </Box>
    </Card>
  );
};

export default NewTag;
