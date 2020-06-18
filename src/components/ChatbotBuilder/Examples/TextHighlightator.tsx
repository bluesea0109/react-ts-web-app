import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import Highlighter from "react-highlight-words";
import {  IExample } from '../../../models/chatbot-service';

interface ITextHighlitatorProps {
  rowData: IExample;
  onMouseUp: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectionText: {
      border: 'none',
    },
  }),
);

const TextHighlightator: React.FC<ITextHighlitatorProps> = ({rowData, onMouseUp}) => {
    const classes = useStyles();
    const words = rowData.tags.map((tag:any) => {
      return rowData.text.slice(tag.start, tag.end)

    });
    return (
      <Highlighter
        highlightClassName={classes.selectionText}
        searchWords={[...words]}
        autoEscape={true}
        textToHighlight={rowData.text}
        onMouseUp={onMouseUp}
     />
    );
};

export default TextHighlightator;
