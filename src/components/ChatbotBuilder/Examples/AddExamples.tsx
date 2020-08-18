import { useMutation } from '@apollo/client';
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, LinearProgress } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import { ExpandMore } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import gql from 'graphql-tag';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, useRef, useState } from 'react';
import ExampleForm from './ExampleForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    accordionRoot: {
      boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2)',
      background: '#fff',
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AddExamplesProps {
  refetchOptions: any;
  agentId: number;
  tags: any;
  intents: any;
  onEditExampleClose: () => void;
}

const createExamplesMutation = gql`
    mutation ($agentId: Int!, $examples: [ChatbotService_ExampleInput!]!) {
        ChatbotService_uploadExamples(agentId: $agentId, examples: $examples)
    }
`;

const AddExamples = ({ refetchOptions, agentId, tags, intents, onEditExampleClose }: AddExamplesProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState<any[]>([]);
  const [expanded, setExpanded] = React.useState<string | boolean>(false);
  const lastID = useRef(0);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (panel: string) => (event: ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [createExamples] = useMutation(createExamplesMutation);

  const saveChanges = async () => {
    setLoading(true);

    try {
      await createExamples({
        variables: {
          agentId,
          examples: examples.map(ex => ({
            text: ex.text,
            intentId: ex.intentId,
            tags: ex.tags.map((tag: any) => ({
              start: tag.start,
              end: tag.end,
              tagTypeId: tag.tagType.id,
            })),
          })),
        },
        ...refetchOptions,
      });

      enqueueSnackbar('Examples created successfully', { variant: 'success' });

      onEditExampleClose();
    } catch (e) {
      enqueueSnackbar('Unable to create examples.', { variant: 'error' });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onAdd = () => {
    const currentExamples = Array.from([...examples]);
    setExamples([
      ...currentExamples,
      {
        id: lastID.current + 1,
        intentId: null,
        agentId,
        tags: [],
        text: '',
      },
    ]);

    lastID.current = lastID.current + 1;
  };

  const setUpdatedExample = (updatedExample: any) => {
    console.log(updatedExample);

    const updatedExamples = Array.from([ ...examples ]);
    updatedExamples.splice(examples.findIndex(ex => ex.id === updatedExample.id), 1, { ...updatedExample });

    setExamples([ ...updatedExamples ]);
  };

  return (
    <Dialog fullScreen={true} open={true} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton disabled={loading} edge="start" color="inherit" onClick={onEditExampleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Create Examples
          </Typography>
          <Button disabled={loading} autoFocus={true} color="inherit" onClick={saveChanges}>
            {loading && (
              <CircularProgress
                color="secondary"
                size={20}
              />
            )}
            Create
          </Button>
        </Toolbar>
        {loading && <LinearProgress color="secondary" />}
      </AppBar>
      <Box p={2}>
        <Button disabled={loading} variant="contained" color="primary" onClick={onAdd}>Add New Example Item</Button>
      </Box>
      <Box p={2} mt={4}>
        {examples.map(example => (
          <Accordion
            classes={{
              root: classes.accordionRoot,
            }}
            elevation={4}
            key={example.id}
            expanded={expanded === `panel${example.id}`}
            onChange={handleChange(`panel${example.id}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${example.id}bh-content`}
              id={`panel${example.id}bh-header`}
            >
              <Typography className={classes.heading}>Example #{example.id}</Typography>
              <Typography className={classes.secondaryHeading}>{example.text}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {expanded === `panel${example.id}` && (
                <ExampleForm
                  loading={loading}
                  example={example}
                  tags={tags}
                  intents={intents}
                  error={null}
                  onExampleUpdate={setUpdatedExample}
                />
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Dialog>
  );
};

export default AddExamples;
