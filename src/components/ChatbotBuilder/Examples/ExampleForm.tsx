import { Box, Grid, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { IExample, IIntent } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { ExamplesError } from './types';
import { useEditExampleAnnotation } from './useEditExample';

interface ExampleFormProps {
  loading: boolean;
  example?: IExample;
  tags: any;
  intents: IIntent[];
  error?: Maybe<ExamplesError>;
  onExampleUpdate: (updatedExample: any) => void;
}

const ExampleForm = ({ loading, example, tags, intents, error, onExampleUpdate }: ExampleFormProps) => {
  const defaultIntent = example?.intentName ?? intents.find(intent => example?.intentId === intent.id)?.value ?? intents?.[0].value;
  const [intent, setIntent] = useState<string>(defaultIntent);

  const defaultTag = example?.tags?.[0].value ?? tags?.[0].value;
  const [tag, setTag] = useState<string>(defaultTag);

  const [
    colors,
    exampleText,
    setExampleText,
    annotatorState,
    setAnnotatorState,
  ] = useEditExampleAnnotation({ tags, example });

  useEffect(() => {
    const currentIntent = intents.find(int => int.value === intent);
    onExampleUpdate({
      id: example?.id,
      agentId: example?.agentId,
      text: exampleText,
      intentId: currentIntent?.id,
      intentName: currentIntent?.value,
      tags: annotatorState.value?.map((tag: any) => ({
        start: tag.start,
        end: tag.end,
        tagType: {
          value: tag.tag,
          agentId: example?.agentId,
          id: tags.find((t: any) => t.value === tag.tag).id,
        },
      })) ?? [],
    });
    // eslint-disable-next-line
  }, [exampleText, annotatorState.value]);

  useEffect(() => {
    setExampleText(example?.text ?? '');
    setAnnotatorState({
      value: example?.tags.map(tag => ({
        start: tag.start,
        end: tag.end,
        tag: tag.tagType.value,
      })),
      tag,
    });
    // eslint-disable-next-line
  }, []);

  const updateTag = (e: ChangeEvent<{}>, tag: any) => {
    setTag(tag?.value ?? '');
    setAnnotatorState({
      ...annotatorState,
      tag: tag?.value ?? '',
    });
  };

  const updateIntent = (e: ChangeEvent<{}>, intent: IIntent | null) => setIntent(intent?.value ?? '');

  return (
    <Grid container={true}>
      <Grid item={true} xs={6}>
        <Box px={2} py={4}>
          <Box mb={5}>
            <Autocomplete
              disabled={loading}
              id="intentSelector"
              options={intents}
              getOptionLabel={(option: any) => option.value}
              value={intents.find((i: any) => i.value === intent)}
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
              options={tags}
              getOptionLabel={(option: any) => option.value}
              defaultValue={tags[0]}
              onChange={updateTag}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Tags" variant="outlined" />}
            />
          </Box>
          <Box p={2} border="1px solid rgba(0, 0, 0, 0.23)" borderRadius={4}>
            <TextAnnotator
              style={{
                lineHeight: 1.5,
                pointerEvents: (loading || !tag || tags?.length === 0) ? 'none' : 'auto',
              }}
              content={exampleText}
              value={annotatorState.value}
              onChange={(value: any) => setAnnotatorState({ ...annotatorState, value })}
              getSpan={span => ({
                ...span,
                tag,
                color: colors.current[tag],
              })}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ExampleForm;
