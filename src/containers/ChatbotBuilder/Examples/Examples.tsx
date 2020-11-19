import { useMutation, useQuery } from '@apollo/client';
import { IIntent } from '@bavard/agent-config';
import { Box, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
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
import { EXAMPLES_LIMIT } from './constants';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
    },
  }),
);

interface ExamplesProps {
  intent: IIntent;
}

const Examples: React.FC<ExamplesProps> = ({ intent }) => {
  const classes = useStyles();
  const params = useParams<{ agentId: string }>();
  const agentId = parseInt(params.agentId, 10);

  const [filters, setFilters] = useState<ExamplesFilter>();
  const config = useRecoilValue(currentAgentConfig);
  const [currentEdit, setCurrentEdit] = useState<INLUExample | null>();
  const [exampleError, setExampleError] = useState<Maybe<ExamplesError>>();
  const { enqueueSnackbar } = useSnackbar();

  const examplesData = useQuery<ExamplesQueryResults>(getExamplesQuery, {
    variables: {
      agentId,
      intent: intent.name,
      limit: EXAMPLES_LIMIT,
      offset: filters?.offset,
    },
  });

  const refetchOptions = {
    refetchQueries: [
      {
        query: getExamplesQuery,
        variables: {
          agentId,
          intent: intent.name,
          limit: EXAMPLES_LIMIT,
          offset: filters?.offset,
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

  const examples = examplesData?.data?.ChatbotService_examples.data || [];
  const exampleCount = examplesData?.data?.ChatbotService_examples.total || 0;
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

    const isDuplicated = examples.some(
      (each) =>
        each.text === updatedExample.text && each.id !== updatedExample.id,
    );
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

      if (createExampleMutationData.error) {
        if (
          createExampleMutationData.error.message.indexOf('duplicate key') !==
          -1
        ) {
          setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
        }
      } else if (updateExampleMutation.error) {
        if (
          updateExampleMutation.error.message.indexOf('duplicate key') !== -1
        ) {
          setExampleError(ExamplesError.CREATE_ERROR_DUPLICATE_EXAMPLE);
        }
      } else if (resp.errors?.[0]) {
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
    <Box className={classes.root}>
      <ExamplesTable
        updateFilters={updateFilters}
        examples={examples}
        exampleCount={exampleCount}
        examplesPerPage={EXAMPLES_LIMIT}
        filters={filters}
        config={config}
        tagTypes={tagTypes}
        onDelete={onExampleDelete}
        onEdit={onExampleEdit}
        onAdd={onNewExample}
        onUpdateExample={onExampleSave}
      />
      {!!intents && !!tagTypes && !!currentEdit && (
        <Grid container={true} item={true} xs={12}>
          <EditExample
            loading={examplesData.loading}
            tagTypes={tagTypes}
            intent={intent}
            example={currentEdit}
            onEditExampleClose={onExampleEditClose}
            onSaveExample={onExampleSave}
            error={exampleError}
          />
        </Grid>
      )}
    </Box>
  );
};

export default Examples;
