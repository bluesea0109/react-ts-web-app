import { useMutation, useQuery } from '@apollo/client';
import { Box, Grid, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { CHATBOT_DELETE_EXAMPLE } from '../../../common-gql-queries';
import { INLUExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import ContentLoading from '../../ContentLoading';
import { currentAgentConfig } from '../atoms';
import EditExample from './EditExample';
import ExamplesTable from './ExamplesTable';
import {
  createExampleMutation,
  getExamplesQuery,
  saveExampleMutation,
} from './gql';
import {
  CreateExampleMutationResult,
  ExamplesError,
  ExamplesFilter,
  ExamplesQueryResults,
} from './types';

export const EXAMPLES_LIMIT = 10;

const Examples = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [filters, setFilters] = useState<ExamplesFilter>();
  const config = useRecoilValue(currentAgentConfig);
  const [currentEdit, setCurrentEdit] = useState<INLUExample | null>();
  const [exampleError, setExampleError] = useState<Maybe<ExamplesError>>();
  const { enqueueSnackbar } = useSnackbar();

  const examplesData = useQuery<ExamplesQueryResults>(getExamplesQuery, {
    variables: {
      agentId: Number(agentId),
      limit: EXAMPLES_LIMIT,
      offset: filters?.offset,
      intent: filters?.intent,
    },
  });

  const refetchOptions = {
    refetchQueries: [
      {
        query: getExamplesQuery,
        variables: {
          agentId: Number(agentId),
          limit: EXAMPLES_LIMIT,
          offset: filters?.offset,
          intent: filters?.intent,
        },
      },
    ],
    awaitRefetchQueries: true,
  };

  const [deleteExample, deleteExampleMutation] = useMutation(
    CHATBOT_DELETE_EXAMPLE,
    {
      ...refetchOptions,
    },
  );

  const [updateExample, updateExampleMutation] = useMutation(
    saveExampleMutation,
    {
      ...refetchOptions,
    },
  );

  const [createExample, createExampleMutationData] = useMutation<
    CreateExampleMutationResult
  >(createExampleMutation, {
    ...refetchOptions,
  });

  const commonError =
    examplesData.error ||
    deleteExampleMutation.error ||
    updateExampleMutation.error;

  const examples = examplesData?.data?.ChatbotService_examples || [];
  const tagTypes = Array.from(config?.getTagTypes() || []);
  const intents = Array.from(config?.getIntents().map((x) => x.name) || []);

  if (commonError) {
    enqueueSnackbar('An error occurred while loading NLU Examples.', {
      variant: 'error',
    });
    return <div />;
  }

  if (!config) {
    return <Typography>{'Agent config is empty.'}</Typography>;
  }

  if (examplesData.loading || !examplesData.data) {
    return <ContentLoading shrinked={true} />;
  }

  const updateFilters = (newFilters: ExamplesFilter) => {
    const resetIntent = !!filters?.intent && !newFilters.intent;
    const changeIntent =
      !!newFilters?.intent && filters?.intent !== newFilters?.intent;

    if (resetIntent || changeIntent) {
      newFilters['offset'] = 0;
    }

    setFilters({ ...filters, ...newFilters });
  };

  const onExampleEdit = (example: INLUExample) => {
    setCurrentEdit(example);
  };

  const onExampleDelete = async (example: INLUExample) => {
    await deleteExample({
      variables: {
        exampleId: example.id,
      },
    });
  };

  const onExampleEditClose = () => {
    setCurrentEdit(null);
  };

  const onExampleSave = async (updatedExample: INLUExample) => {
    const example = {
      ...(updatedExample.id === -1 ? {} : { id: updatedExample.id }),
      text: updatedExample.text,
      intent: updatedExample.intent,
      tags: updatedExample.tags,
    };

    const isDuplicated = examples.some(each => each.text === updatedExample.text && each.id !== updatedExample.id);
    if (isDuplicated) {
      enqueueSnackbar(`The example is duplicated.`, { variant: 'error' });
      return;
    }

    const mutationOpts = {
      variables: {
        example,
        agentId: Number(agentId),
      },
    };

    let resp: any;

    try {
      if (updatedExample.id === -1) {
        resp = await createExample(mutationOpts);
      } else {
        resp = await updateExample(mutationOpts);
      }

      if (!!createExampleMutationData.error) {
        if (
          createExampleMutationData.error.message.indexOf('duplicate key') !==
          -1
        ) {
          setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
        }
      } else if (!!updateExampleMutation.error) {
        if (
          updateExampleMutation.error.message.indexOf('duplicate key') !== -1
        ) {
          setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
        }
      } else if (!!resp.errors?.[0]) {
        if (resp.errors[0].message.indexOf('duplicate key') !== -1) {
          setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
        }
      } else {
        onExampleEditClose();
      }
    } catch (e) {
      if (`${e}`.indexOf('duplicate key') !== -1) {
        setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
      }
    }
  };

  const onNewExample = () => {
    setCurrentEdit({
      id: -1,
      agentId: Number(agentId),
      intent: '',
      text: '',
      tags: [],
    });
  };

  return (
    <Grid container={true}>
      <Grid container={true}>
        <Grid item={true} container={true}>
          <Box fontWeight="bold" fontSize={24}>
            Natural Language Understanding Examples
          </Box>
        </Grid>
        <Grid item={true} container={true} sm={6}>
          <Box fontSize={16} my={2} lineHeight={1.5}>
            Add or delete examples of natural language below to improve your
            Assistant’s detection of the user’s intent.
          </Box>
        </Grid>
      </Grid>
      <Grid container={true}>
        <Grid container={true} item={true} xs={12}>
          <ExamplesTable
            updateFilters={updateFilters}
            examples={examples}
            intents={intents}
            filters={filters}
            config={config}
            onDelete={onExampleDelete}
            onEdit={onExampleEdit}
            onAdd={onNewExample}
            onUpdateExample={onExampleSave}
          />
        </Grid>
        {!!intents && !!tagTypes && !!currentEdit && (
          <Grid container={true} item={true} xs={12}>
            <EditExample
              loading={examplesData.loading}
              tagTypes={tagTypes}
              intents={intents}
              example={currentEdit}
              onEditExampleClose={onExampleEditClose}
              onSaveExample={onExampleSave}
              error={exampleError}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Examples;
