import { Box, CircularProgress, Grid, LinearProgress, TextField } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Autocomplete } from '@material-ui/lab';
import randomcolor from 'randomcolor';
import React, { useEffect, useRef, useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { IExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type EditExampleProps = {
  isNew: boolean;
  loading: boolean;
  example?: IExample;
  tags: any;
  intents: any;
  onEditExampleClose: () => void;
  onSaveExample: (updatedExample: IExample) => Promise<void>;
};

const EditExample = (props: EditExampleProps) => {
  const { isNew, loading, example, tags, intents, onEditExampleClose, onSaveExample } = props;

  const classes = useStyles();
  const [currentExample, setCurrentExample] = useState<Maybe<IExample>>(example);
  const [state, setState] = useState<any>({});
  const [intent, setIntent] = useState<string>('');
  const colors = useRef<any>({});

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
      tag: tags[0].value,
    });

    const intent = intents.find(({ id }: any) => id === example?.intentId);
    setIntent(intent?.value);
  // eslint-disable-next-line
  }, [example]);

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

  const saveChanges = async () => {
    if (!!currentExample) {
      const currIntent = intents.find((i: any) => i.value === intent);
      const finalExampleObj = {
        id: currentExample.id,
        agentId: currentExample.agentId,
        text: currentExample.text,
        intentId: currIntent.id,
        intentName: currIntent.name,
        tags: state.value.map((tag: any) => ({
          start: tag.start,
          end: tag.end,
          tagType: {
            value: tag.tag,
            agentId: currentExample.agentId,
            id: tags.find((t: any) => t.value === tag.tag).id,
          },
        })),
      };

      await onSaveExample(finalExampleObj);
    }
  };

  if (!!currentExample) {
    return (
      <Dialog fullScreen={true} open={true} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton disabled={loading} edge="start" color="inherit" onClick={onEditExampleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {isNew ? "Add New Example" : `Edit Example #${currentExample.id}`}
            </Typography>
            <Button disabled={loading} autoFocus={true} color="inherit" onClick={saveChanges}>
              {loading && (
                <CircularProgress
                  color="secondary"
                  size={20}
                />
              )}
              {!loading && "save"}
            </Button>
          </Toolbar>
          {loading && <LinearProgress color="secondary" />}
        </AppBar>
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
                value={currentExample.text}
                onChange={onExampleTextChange}
              />
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
                    pointerEvents: loading ? "none" : "auto"
                  }}
                  content={currentExample.text}
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
      </Dialog>
    );
  } else { return null; }
};

export default EditExample;
