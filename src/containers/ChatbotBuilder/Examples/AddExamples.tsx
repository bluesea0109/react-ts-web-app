import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Delete } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { INLUExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { ExamplesError } from './types';
import { useEditExampleAnnotation } from './useEditExample';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    exampleHeader: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    exampleForm: {
      padding: '20px',
      backgroundColor: '#EAEAEA',
      marginBottom: '15px',
      marginTop: '30px',
    },
    cols: {
      width: '100%',
      backgroundColor: 'white',
    },
  }),
);

interface AddExampleItemProps {
  loading: boolean;
  error?: Maybe<ExamplesError>;
  tagType: string;
  tagTypes: string[];
  example: INLUExample;
  onExampleUpdate: (updatedExample: INLUExample) => void;
  onDeleteExample: () => void;
}

export const AddExampleItem = ({
  loading,
  error,
  tagType,
  tagTypes,
  example,
  onExampleUpdate,
  onDeleteExample,
}: AddExampleItemProps) => {
  const [
    exampleText,
    setExampleText,
    annotatorState,
    setAnnotatorState,
    colors,
  ] = useEditExampleAnnotation({ tagTypes });

  const [focused, setFocus] = useState<boolean>(false);

  const handleBlur = () => {
    if (!exampleText.length) {
      setFocus(false);
    }
  };
  const classes = useStyles();
  useEffect(() => {
    setAnnotatorState({
      ...annotatorState,
      tagType,
    });
    // eslint-disable-next-line
  }, [tagType]);

  useEffect(() => {
    onExampleUpdate({
      id: example?.id,
      agentId: example?.agentId,
      intent: '',
      text: exampleText,
      tags:
        annotatorState.tags.map((tag) => ({ ...tag, tagType: tag.tag })) ?? [],
    });
    // eslint-disable-next-line
  }, [exampleText, annotatorState.tags]);

  return (
    <div className={classes.exampleForm}>
      <div className={classes.exampleHeader}>
        <Typography>Example {example.id} </Typography>
        <IconButton onClick={onDeleteExample}>
          <Delete />
        </IconButton>
      </div>
      <>
        <TextField
          disabled={loading}
          fullWidth={true}
          multiline={true}
          variant="outlined"
          rows={2}
          className={classes.cols}
          value={example.text}
          onChange={(e) => setExampleText(e.target.value)}
          error={error === ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE}
          onFocus={() => setFocus(true)}
          onBlur={handleBlur}
        />
        <Typography
          variant="h6"
          color="error"
          style={{ fontWeight: 'bold', marginTop: 16 }}>
          {error === ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE
            ? 'Cannot create duplicate example entry. Please try again with different values.'
            : null}
        </Typography>
      </>
      {focused && (
        <>
          <Typography>Highlight text to identify it as a tag.</Typography>
          <TextAnnotator
            style={{
              borderRadius: '3px',
              border: '1px solid #ccc',
              lineHeight: 1.5,
              pointerEvents:
                loading || !tagType || tagTypes?.length === 0 ? 'none' : 'auto',
              minHeight: 40,
              backgroundColor: 'white',
              padding: '15px',
              cursor: 'pointer',
            }}
            content={example.text}
            value={annotatorState.tags}
            onChange={(value: any) =>
              setAnnotatorState({ ...annotatorState, tags: value })
            }
            getSpan={(span) => ({
              ...span,
              tag: tagType,
              color: colors.current[tagType],
            })}
            className={classes.cols}
          />
        </>
      )}
    </div>
  );
};

export default AddExampleItem;
