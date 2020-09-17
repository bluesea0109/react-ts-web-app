import { Box, Grid, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { INLUExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { ExamplesError } from './types';
import { useEditExampleAnnotation } from './useEditExample';

interface ExampleFormProps {
  loading: boolean;
  example?: INLUExample;
  tagTypes: string[];
  intents: string[];
  error?: Maybe<ExamplesError>;
  onExampleUpdate: (updatedExample: any) => void;
}

const ExampleForm = ({ loading, example, tagTypes, intents, error, onExampleUpdate }: ExampleFormProps) => {
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
    const currentIntent = intent;
    onExampleUpdate({
      id: example?.id,
      agentId: example?.agentId,
      text: exampleText,
      intent: currentIntent,
      tags: annotatorState.tags,
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

  const updateTagType = (e: ChangeEvent<{}>, tagType: string | null) => {
    setTagType(tagType || '');
    setAnnotatorState({
      ...annotatorState,
      tagType: tagType || '',
    });
  };

  const updateIntent = (e: ChangeEvent<{}>, intent: string | null) => setIntent(intent ?? '');

  return (
    <Grid container={true}>
      <Grid item={true} xs={6}>
        <Box px={2} py={4}>
          <Box mb={5}>
            <Autocomplete
              disabled={loading}
              id="intentSelector"
              options={intents}
              value={intent}
              onChange={updateIntent}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Intents" variant="outlined" />}
            />
          </Box>
          <TextField
            disabled={loading}
            fullWidth={true}
            multiline={true}
            variant="outlined"
            rows={20}
            value={exampleText}
            onChange={e => setExampleText(e.target.value)}
            error={error === ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE}
          />
          <Typography variant="h6" color="error" style={{ fontWeight: 'bold', marginTop: 16 }}>
            {
              error === ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE ?
                'Cannot create duplicate example entry. Please try again with different values.' :
                null
            }
          </Typography>
        </Box>
      </Grid>
      <Grid item={true} xs={6}>
        <Box px={2} py={4}>
          <Box mb={5}>
            <Autocomplete
              disabled={loading}
              id="tagSelector"
              options={tagTypes}
              defaultValue={tagTypes?.[0]}
              onChange={updateTagType}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Tags" variant="outlined" />}
            />
          </Box>
          <Box p={2} border="1px solid rgba(0, 0, 0, 0.23)" borderRadius={4}>
            <TextAnnotator
              style={{
                lineHeight: 1.5,
                pointerEvents: (loading || !tagType || tagTypes?.length === 0) ? 'none' : 'auto',
              }}
              content={exampleText}
              value={annotatorState.tags}
              onChange={(value: any) => setAnnotatorState({ ...annotatorState, value })}
              getSpan={span => ({
                ...span,
                tag: tagType,
                color: colors.current[tagType],
              })}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ExampleForm;
