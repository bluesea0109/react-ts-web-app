import { Box, CircularProgress, createStyles, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useParams } from 'react-router';
import { CHATBOT_DELETE_EXAMPLE, CHATBOT_GET_TAGS } from '../../../common-gql-queries';
import { IExample } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import EditExample from './EditExample';
import ExamplesTable from './ExamplesTable';
import { createExampleMutation, getExamplesQuery, getIntentsQuery, saveExampleMutation } from './gql';
import {
  CreateExampleMutationResult,
  ExamplesFilter,
  ExamplesQueryResults,
  IntentsQueryResults,
  TagsQueryResult,
} from './types';

export const EXAMPLES_LIMIT = 10;

const useStyles = makeStyles(theme =>
  createStyles({
    fabContainer: {
      position: 'fixed',
      right: theme.spacing(2),
      bottom: theme.spacing(2),
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    fabProgress: {
      color: theme.palette.secondary.main,
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1,
    },
  }),
);

const Examples = () => {
  const { agentId } = useParams();
  const classes = useStyles();

  const [currentEdit, setCurrentEdit] = useState<number | null>();
  const [filters, setFilters] = useState<ExamplesFilter>();
  const [rendered, rerender] = useState(false);
  const [newExample, setNewExample] = useState<IExample | null>(null);

  useEffect(() => {
    if (rendered) {
      rerender(false);
    }
  }, [rendered]);

  const numAgentId = Number(agentId);

  const tagsData = useQuery<TagsQueryResult>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const intentsData = useQuery<IntentsQueryResults>(getIntentsQuery, { variables: { agentId: numAgentId } });

  const examplesData = useQuery<ExamplesQueryResults>(getExamplesQuery, {
    variables: {
      agentId: numAgentId,
      limit: EXAMPLES_LIMIT,
      offset: filters?.offset,
      intentId: filters?.intentId,
    },
  });

  const tags = tagsData.data?.ChatbotService_tagTypes;
  const intents = intentsData.data?.ChatbotService_intents;
  const examples = examplesData.data?.ChatbotService_examples;

  const [deleteExample, deleteExampleMutation] = useMutation(CHATBOT_DELETE_EXAMPLE, {
    refetchQueries: [
      {
        query: getExamplesQuery,
        variables: {
          agentId: numAgentId,
          limit: EXAMPLES_LIMIT,
          offset: filters?.offset,
          intentId: filters?.intentId,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  const [updateExample, updateExampleMutation] = useMutation(saveExampleMutation, {
    refetchQueries: [
      {
        query: getExamplesQuery,
        variables: {
          agentId: numAgentId,
          limit: EXAMPLES_LIMIT,
          offset: filters?.offset,
          intentId: filters?.intentId,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  const [createExample, createExampleMutationData] = useMutation<CreateExampleMutationResult>(createExampleMutation, {
    variables: {
      agentId: numAgentId,
    },
  });

  const commonError = examplesData.error || deleteExampleMutation.error || updateExampleMutation.error;
  if (commonError) {
    return <ApolloErrorPage error={commonError} />;
  }

  const onExampleEdit = (exampleID: number) => {
    setCurrentEdit(exampleID);
  };

  const onExampleDelete = async (exampleId: number) => {
    await deleteExample({
      variables: {
        exampleId,
      },
    });
  };

  const onExampleEditClose = () => {
    setCurrentEdit(null);
  };

  const onExampleSave = async (updatedExample: IExample) => {
    const example = {
      id: updatedExample.id,
      text: updatedExample.text,
      intentId: updatedExample.intentId,
      tags: updatedExample.tags.map((tag: any) => ({
        start: tag.start,
        end: tag.end,
        tagTypeId: tag.tagType.id,
      })),
    };

    await updateExample({
      variables: {
        example,
      },
    });

    setCurrentEdit(null);
    setNewExample(null);
  };

  const loading = examplesData.loading || deleteExampleMutation.loading || updateExampleMutation.loading;

  const createNewExample = async () => {
    const data = await createExample();
    setNewExample(data.data?.ChatbotService_createExample ?? null);
  };

  const updateFilters = (newFilters: ExamplesFilter) => {
    const resetIntent = !!filters?.intentId && !newFilters.intentId;
    const changeIntent = !!newFilters?.intentId && filters?.intentId !== newFilters?.intentId;

    if (resetIntent || changeIntent) {
      newFilters['offset'] = 0;
    }

    setFilters({ ...filters, ...newFilters });
  };

  return (
    <>
      <ExamplesTable
        loading={loading}
        updateFilters={updateFilters}
        examples={examples}
        intents={intents}
        filters={filters}
        onDelete={onExampleDelete}
        onEdit={onExampleEdit}
      />
      {(!!currentEdit || !!newExample) && (
        <EditExample
          isNew={!!newExample}
          loading={loading}
          tags={tags}
          intents={intents}
          example={!!newExample ? newExample : examples?.find(ex => ex.id === currentEdit)}
          onEditExampleClose={onExampleEditClose}
          onSaveExample={onExampleSave}
        />
      )}
      <Box className={classes.fabContainer}>
        <div className={classes.wrapper}>
          <Fab
            disabled={createExampleMutationData.loading}
            aria-label="save"
            color="primary"
            onClick={createNewExample}
          >
            <Add />
          </Fab>
          {createExampleMutationData.loading && <CircularProgress size={68} className={classes.fabProgress} />}
        </div>
      </Box>
    </>
  );
};

export default Examples;
