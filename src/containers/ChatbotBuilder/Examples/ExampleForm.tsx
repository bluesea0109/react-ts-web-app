import { IIntent } from '@bavard/agent-config';
import { DropDown, TextInput } from '@bavard/react-components';
import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useEffect, useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { INLUExample } from '../../../models/chatbot-service';
import { useEditExampleAnnotation } from './useEditExample';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
      padding: theme.spacing(2),
      backgroundColor: '#EAEAEA',
      position: 'relative',
    },
    formField: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    input: {
      '& .MuiOutlinedInput-input': {
        padding: '12px 12px',
        backgroundColor: 'white',
      },
    },
    trashButton: {
      position: 'absolute',
      top: '5px',
      right: '0px',
    },
  }),
);

interface ExampleFormProps {
  isNew?: boolean;
  loading: boolean;
  example: INLUExample;
  tagTypes: string[];
  intent: IIntent;
  onDelete?: () => void;
  onSaveChanges: () => void;
  onExampleUpdate: (updatedExample: INLUExample) => void;
}

const ExampleForm: React.FC<ExampleFormProps> = ({
  isNew,
  loading,
  example,
  tagTypes,
  intent,
  onDelete,
  onSaveChanges,
  onExampleUpdate,
}) => {
  const classes = useStyles();

  const defaultTagType = example?.tags?.[0]?.tagType ?? tagTypes?.[0];
  const [tagType, setTagType] = useState<string>(defaultTagType);

  const [
    exampleText,
    setExampleText,
    annotatorState,
    setAnnotatorState,
    colors,
  ] = useEditExampleAnnotation({ tagTypes });

  useEffect(() => {
    if (!example?.id) return;
    onExampleUpdate({
      id: example?.id,
      agentId: example?.agentId,
      text: exampleText,
      intent: intent.name,
      tags: annotatorState.tags.map((tag) => ({
        tagType: tag.tag,
        start: tag.start,
        end: tag.end,
      })),
    });
    // eslint-disable-next-line
  }, [intent, example?.id, example?.agentId, exampleText, annotatorState.tags]);

  useEffect(() => {
    setExampleText(example?.text ?? '');
    setAnnotatorState({
      tags: example?.tags || [],
      tagType,
    });
    // eslint-disable-next-line
  }, []);

  const updateTagType = (tagType: string | null) => {
    setTagType(tagType || '');
    setAnnotatorState({
      ...annotatorState,
      tagType: tagType || '',
    });
  };

  return (
    <Grid container={true}>
      <Paper className={classes.paper}>
        {onDelete && (
          <IconButton
            size="small"
            color="default"
            className={classes.trashButton}
            onClick={onDelete}>
            <DeleteIcon color="secondary" fontSize="small" />
          </IconButton>
        )}
        <Grid container={true} className={classes.formField}>
          <TextInput
            fullWidth={true}
            label={`NLU Example ${example?.id || 1}*`}
            rows={4}
            value={exampleText}
            className={classes.input}
            onChange={(e) => setExampleText(e.target.value)}
          />
        </Grid>

        <Grid container={true} className={classes.formField}>
          <DropDown
            fullWidth={true}
            label="Selected Tag Type"
            labelPosition="top"
            menuItems={tagTypes}
            current={tagType || ''}
            padding="12px"
            variant="Typography"
            onChange={updateTagType}
          />
        </Grid>

        <Grid container={true} className={classes.formField}>
          <Grid container={true} item={true} xs={12}>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
              Highlight text to identify it as a tag.
            </Typography>
          </Grid>
          <Grid container={true} item={true} xs={12}>
            <TextAnnotator
              style={{
                width: '100%',
                minHeight: 120,
                lineHeight: 1.5,
                padding: 12,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                pointerEvents:
                  loading || !tagType || tagTypes?.length === 0
                    ? 'none'
                    : 'auto',
              }}
              content={exampleText}
              value={annotatorState.tags}
              onChange={(value: any) =>
                setAnnotatorState({ ...annotatorState, tags: value })
              }
              getSpan={(span) => ({
                ...span,
                tag: tagType,
                color: colors.current[tagType],
              })}
            />
          </Grid>
        </Grid>

        {isNew !== undefined && (
          <Grid container={true} item={true} xs={12} justify="center">
            <Button
              autoFocus={true}
              color="primary"
              variant="contained"
              onClick={onSaveChanges}>
              {isNew ? 'Add Example' : 'Update Example'}
            </Button>
          </Grid>
        )}
      </Paper>
    </Grid>
  );
};

export default ExampleForm;
