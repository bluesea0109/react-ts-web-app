import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import Highlighter from 'react-highlight-words';
import {  IExample } from '../../../models/chatbot-service';

interface ITextHighlitatorProps {
  example: IExample;
  onSelectExample: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectionText: {
      border: 'none',
    },
  }),
);

const TextHighlightator: React.FC<ITextHighlitatorProps> = ({example, onSelectExample}) => {
    const classes = useStyles();
    const words = example.tags.map((tag: any) => {
      return example.text.slice(tag.start, tag.end);
    });
    return (
      <Highlighter
        highlightClassName={classes.selectionText}
        searchWords={[...words]}
        autoEscape={true}
        textToHighlight={example.text}
        onMouseUp={onSelectExample}
     />
    );
};

export default TextHighlightator;
