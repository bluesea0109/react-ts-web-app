import { useMutation, useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { CHATBOT_DELETE_EXAMPLE } from '../../../common-gql-queries';
import { INLUExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import ContentLoading from '../../ContentLoading';
import { currentAgentConfig } from '../atoms';
import AddExamples from './AddExamples';
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

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Examples = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [filters, setFilters] = useState<ExamplesFilter>();
  const [invalidIntents, setInvalidIntents] = useState<string[]>([]);
  const [invalidExamples, setInvalidExamples] = useState<INLUExample[]>([]);
  const config = useRecoilValue(currentAgentConfig);
  const [currentEdit, setCurrentEdit] = useState<number | null>();
  const [newExample, setNewExample] = useState<INLUExample | null>(null);
  const [invalidExist, setInvalidExist] = useState<boolean>(false);
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
    }
  );

  const [updateExample, updateExampleMutation] = useMutation(
    saveExampleMutation,
    {
      ...refetchOptions,
    }
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

  useEffect(() => {
    let tempInvalidIntents: string[] = [];
    let tempInvalidExamples: INLUExample[] = [];

    if (examples.length !== 0) {
      examples.map((example) => {
        if (intents.includes(example.intent) === false) {
          tempInvalidIntents = [...tempInvalidIntents, example.intent];
          tempInvalidExamples = [...tempInvalidExamples, example];
        }
      });
    }

    const distinctInvalidIntents: string[] = tempInvalidIntents.filter(
      (v, i, a) => a.indexOf(v) === i
    );

    if (distinctInvalidIntents.length > 0) {
      setInvalidExist(true);
      setInvalidIntents(distinctInvalidIntents);
      setInvalidExamples(tempInvalidExamples);
    }
  }, [examples]);

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
    return <ContentLoading />;
  }

  const tagTypes = Array.from(config.getTagTypes());
  const intents = Array.from(config.getIntents().map((x) => x.name));

  const updateFilters = (newFilters: ExamplesFilter) => {
    const resetIntent = !!filters?.intent && !newFilters.intent;
    const changeIntent =
      !!newFilters?.intent && filters?.intent !== newFilters?.intent;

    if (resetIntent || changeIntent) {
      newFilters['offset'] = 0;
    }

    setFilters({ ...filters, ...newFilters });
  };

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
    setNewExample(null);
  };

  const onExampleSave = async (updatedExample: INLUExample) => {
    const example = {
      ...(updatedExample.id === -1 ? {} : { id: updatedExample.id }),
      text: updatedExample.text,
      intent: updatedExample.intent,
      tags: updatedExample.tags,
    };

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

  const startNewExample = () => {
    setNewExample({
      id: -1,
      agentId: Number(agentId),
      intent: '',
      text: '',
      tags: [],
    });
  };

  return (
    <>
      <ExamplesTable
        updateFilters={updateFilters}
        examples={examples}
        intents={intents}
        filters={filters}
        invalidExist={invalidExist}
        invalidIntents={invalidIntents}
        invalidExamples={invalidExamples}
        config={config}
        onDelete={onExampleDelete}
        onEdit={onExampleEdit}
        onAdd={startNewExample}
      />
      {!!invalidExist && (
        <Alert severity="error">This is an error message!</Alert>
      )}
      {!!intents && !!tagTypes && (
        <>
          <EditExample
            loading={examplesData.loading}
            tagTypes={tagTypes}
            intents={intents}
            example={examples?.find((ex) => ex.id === currentEdit)}
            onEditExampleClose={onExampleEditClose}
            onSaveExample={onExampleSave}
            error={exampleError}
          />
          {!!newExample && (
            <AddExamples
              onEditExampleClose={onExampleEditClose}
              refetchOptions={refetchOptions}
            />
          )}
        </>
      )}
    </>
  );
};

export default Examples;
