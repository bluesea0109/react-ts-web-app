import { Button, createStyles, Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { DropDown, TextInput } from '../../../components';
import { INLUExample } from '../../../models/chatbot-service';
import { useEditExampleAnnotation } from './useEditExample';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
      padding: theme.spacing(2),
      backgroundColor: '#EAEAEA',
    },
    intentField: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
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
  }),
);

interface ExampleFormProps {
  isNew: boolean;
  loading: boolean;
  example?: INLUExample;
  tagTypes: string[];
  intents: string[];
  onSaveChanges: () => void;
  onExampleUpdate: (updatedExample: INLUExample) => void;
}

const ExampleForm = ({
  isNew,
  loading,
  example,
  tagTypes,
  intents,
  onSaveChanges,
  onExampleUpdate,
}: ExampleFormProps) => {
  const classes = useStyles();
  const defaultIntent = example?.intent ?? intents?.[0];
  const [intent, setIntent] = useState<string>(defaultIntent);

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
    if (!example) { return; }
    const currentIntent = intent;
    onExampleUpdate({
      id: example?.id,
      agentId: example?.agentId,
      text: exampleText,
      intent: currentIntent,
      tags: annotatorState.tags.map(tag => ({
        tagType: tag.tag,
        start: tag.start,
        end: tag.end,
      })),
    });
    // eslint-disable-next-line
  }, [exampleText, annotatorState.tags]);

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
      <Grid container={true} item={true} sm={12} className={classes.intentField}>
        <DropDown
          fullWidth={true}
          label="Intent"
          labelPosition="left"
          menuItems={intents}
          current={intent}
          padding="12px"
          onChange={setIntent}
        />
      </Grid>
      <Paper className={classes.paper}>
        <Grid container={true} className={classes.formField}>
          <TextInput
            fullWidth={true}
            label="NLU Example 1"
            rows={4}
            value={exampleText}
            className={classes.input}
            onChange={e => setExampleText(e.target.value)}
          />
        </Grid>

        <Grid container={true} className={classes.formField}>
          <DropDown
            fullWidth={true}
            label="Selected Tag Type"
            labelPosition="left"
            menuItems={tagTypes}
            current={tagTypes?.[0]}
            padding="12px"
            onChange={updateTagType}
          />
        </Grid>

        <Grid container={true} className={classes.formField}>
          <Grid container={true} item={true} xs={12}>
            <Typography variant="subtitle1" style={{fontWeight: 'bold'}}>
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
                pointerEvents: (loading || !tagType || tagTypes?.length === 0) ? 'none' : 'auto',
              }}
              content={exampleText}
              value={annotatorState.tags}
              onChange={(value: any) => setAnnotatorState({ ...annotatorState, tags: value })}
              getSpan={span => ({
                ...span,
                tag: tagType,
                color: colors.current[tagType],
              })}
            />
          </Grid>
        </Grid>

        <Grid container={true} item={true} xs={12} justify="center">
          <Button autoFocus={true} color="primary" variant="contained" onClick={onSaveChanges}>
            {isNew ? 'Add Example' : 'Update Example'}
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ExampleForm;
