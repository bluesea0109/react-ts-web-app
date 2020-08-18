import { Box, Grid, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { IExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { ExamplesError } from './types';
import { useNewExample } from './useNewExample';

interface ExampleFormProps {
  loading: boolean;
  example?: IExample;
  tags: any;
  intents: any;
  error: Maybe<ExamplesError>;
  onExampleUpdate: (updatedExample: any) => void;
}

const ExampleForm = ({ loading, example, tags, intents, error, onExampleUpdate }: ExampleFormProps) => {
  const [values, updateValues] = useNewExample({ example, intents, tags, onExampleUpdate });
  const { state, intent, colors, updatedExample } = values;
  const { setState, setIntent, updateTagsOnText, onExampleTextChange } = updateValues;

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
            value={updatedExample?.text}
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
              content={updatedExample?.text ?? ''}
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
