import classes from '*.module.css';
import {
  Button,
  createStyles,
  makeStyles,
  TextareaAutosize,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import React, { useRef, useState } from 'react';

interface IntentExampleFormProps {
  label: string;
  onChange: (id: string, content: string) => void;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    exampleHeader: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    exampleForm: {
      padding: '20px',
      backgroundColor: '#EAEAEA',
      marginBottom: '15px',
      marginTop: '15px',
    },
    cols: {
      width: '98%',
    },
  }),
);

export const IntentExampleForm = ({
  label,
  onChange,
}: IntentExampleFormProps) => {
  const classes = useStyles();
  const exInput = useRef(null);

  const [isTyping, setTyping] = useState<boolean>(false);
  const [example, setExample] = useState<string>('');
  const [echo, setEcho] = useState<string>('');
  const handleFocus = () => {
    console.log('con');
    setTyping(true);
  };

  const handleBlur = () => {
    if (echo.length === 0) {
      setTyping(false);
    }
  };

  const handleChange = (e: any) => {
    console.log('change???', e.target.value);
    onChange(label, e.target.value);
    setEcho(e.target.value);
    if (e.target.type.length === 0) {
      setTyping(false);
    }
  };
  return (
    <>
      <div className={classes.exampleForm}>
        <div className={classes.exampleHeader}>
          <Typography>Example </Typography>
          <div>
            <Delete />
          </div>
        </div>
        <TextareaAutosize
          onFocus={handleFocus}
          onBlur={handleBlur}
          rowsMin={4}
          aria-label="maximum height"
          placeholder="Example sentence"
          defaultValue=""
          className={classes.cols}
          onChange={handleChange}
        />
        {isTyping && (
          <TextareaAutosize
            rowsMin={4}
            aria-label="maximum height"
            placeholder="Example sentence"
            value={echo}
            className={classes.cols}
          />
        )}
      </div>
    </>
  );
};
