import { Box, Grid, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab';
import randomcolor from 'randomcolor';
import React, { useEffect, useRef, useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { IExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { ExamplesError } from './types';

interface ExampleFormProps {
  loading: boolean;
  example?: IExample;
  tags: any;
  intents: any;
  error: Maybe<ExamplesError>;
  onExampleUpdate: (updatedExample: any) => void;
}

const ExampleForm = ({ loading, example, tags, intents, error, onExampleUpdate }: ExampleFormProps) => {
  const [currentExample, setCurrentExample] = useState<Maybe<IExample>>(example);
  const [state, setState] = useState<any>({});
  const [intent, setIntent] = useState<string>('');
  const colors = useRef<any>({});

  useEffect(() => {
    if (!!currentExample) {
      const currIntent = intents.find((i: any) => i.value === intent);
      onExampleUpdate({
        id: currentExample.id,
        agentId: currentExample.agentId,
        text: currentExample.text,
        intentId: currIntent?.id,
        intentName: currIntent?.name,
        tags: state.value?.map((tag: any) => ({
          start: tag.start,
          end: tag.end,
          tagType: {
            value: tag.tag,
            agentId: currentExample.agentId,
            id: tags.find((t: any) => t.value === tag.tag).id,
          },
        })) ?? [],
      });
    }
  // eslint-disable-next-line
  }, [currentExample, intent, intents, state.value, tags]);

  useEffect(() => {
    const randColors = randomcolor({
      luminosity: 'light',
      count: tags.length,
    });

    let currIndex = 0;

    tags.forEach((tag: any) => {
      colors.current = {
        ...colors.current,
        [tag.value]: randColors[currIndex],
      };

      currIndex += 1;
    });
  }, [tags]);

  useEffect(() => {
    setCurrentExample(example);
    setState({
      value: example?.tags.map((tag: any) => {
        return {
          start: tag.start,
          end: tag.end,
          tag: tag.tagType.value,
        };
      }),
      tag: tags[0]?.value,
    });

    const intent = intents.find(({ id }: any) => id === example?.intentId);
    setIntent(intent?.value);
    // eslint-disable-next-line
  }, []);

  const updateTagsOnText = (updatedTags: any[]) => {
    setState({
      ...state,
      value: [ ...updatedTags ],
    });
  };

  const onExampleTextChange = (e: any) => {
    const updatedExample = { ...(currentExample as IExample) };
    updatedExample.text = e.target.value;

    setCurrentExample({ ...updatedExample });
  };

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
              onChange={(e, intent) => setIntent(intent?.value)}
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
            value={currentExample?.text}
            onChange={onExampleTextChange}
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
              onChange={(e, tag) => setState({ ...state, tag: tag?.value })}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Tags" variant="outlined" />}
            />
          </Box>
          <Box p={2} border="1px solid rgba(0, 0, 0, 0.23)" borderRadius={4}>
            <TextAnnotator
              style={{
                lineHeight: 1.5,
                pointerEvents: (loading || !state.tag || tags?.length === 0) ? 'none' : 'auto',
              }}
              content={currentExample?.text ?? ''}
              value={state.value}
              onChange={(value: any) => updateTagsOnText(value)}
              getSpan={span => ({
                ...span,
                tag: state.tag,
                color: colors.current[state.tag],
              })}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default React.memo(ExampleForm);
