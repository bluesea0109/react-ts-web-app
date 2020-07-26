import { useMutation, useQuery } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { IIntent } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import { IntentsQueryResults } from '../Examples/types';
import { getIntentsQuery } from '../Intent/gql';
import EditOption from './EditOption';
import { createOptionMutation, deleteOptionMutation, getOptionsQuery, updateOptionMutation } from './gql';
import OptionsTable from './OptionsTable';
import { GetOptionsQueryResult, IOption, IOptionInput, IOptionType, ITextOptionInput } from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

const Options = () => {
  const classes = useStyles();
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const [currentOption, setCurrentOption] = useState<Maybe<number>>();
  const [newOption, setNewOption] = useState(false);

  const defaultOptionVal: ITextOptionInput = {
    intentId: -1,
    text: '',
    type: IOptionType.TEXT,
  };

  const { data, loading, error } = useQuery<GetOptionsQueryResult>(getOptionsQuery, {
    variables: { agentId: numAgentId },
  });
  const intentsData = useQuery<IntentsQueryResults>(getIntentsQuery, { variables: { agentId: numAgentId } });

  const [createOption, createOptionMutationData] = useMutation(createOptionMutation, {
    refetchQueries: [{ query: getOptionsQuery, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true,
  });

  const [updateOption, updateOptionMutationData] = useMutation(updateOptionMutation, {
    refetchQueries: [{ query: getOptionsQuery, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true,
  });

  const [deleteOption, deleteOptionMutationData] = useMutation(deleteOptionMutation, {
      refetchQueries: [{ query: getOptionsQuery, variables: { agentId: numAgentId } }],
      awaitRefetchQueries: true,
    });

  const options: Maybe<IOption[]> = data?.ChatbotService_userResponseOptions;
  const intents: Maybe<IIntent[]> = intentsData.data?.ChatbotService_intents;

  const onEditOption = (id: number) => {
    setCurrentOption(id);
  };

  const onSaveOption = async (optionData: IOptionInput | IOption) => {
    console.log(optionData);

    if (newOption) {
      const { type, ...otherData } = optionData as IOptionInput;
      await createOption({
        variables: {
          agentId: numAgentId,
          ...(type === IOptionType.TEXT ? {
            userTextResponseOption: {
              type,
              ...otherData,
            },
          } : {}),
          ...(type === IOptionType.IMAGE_LIST ? {
            userImageResponseOption: {
              type,
              ...otherData,
            },
          } : {}),
        },
      });
    } else {
      const { id, type, ...otherData } = optionData as IOption;
      await updateOption({
        variables: {
          id,
          ...(type === IOptionType.TEXT ? {
            userTextResponseOption: {
              type,
              ...otherData,
            },
          } : {}),
          ...(type === IOptionType.IMAGE_LIST ? {
            userImageResponseOption: {
              type,
              ...otherData,
            },
          } : {}),
        },
      });
    }

    setCurrentOption(null);
    setNewOption(false);
  };

  const onDeleteOption = async (optionId: number) => {
    await deleteOption({
      variables: {
        id: optionId,
      },
    });
  };

  const onEditOptionClose = () => {
    setCurrentOption(null);
    setNewOption(false);
  };

  const isLoading = loading ||
    updateOptionMutationData.loading ||
    deleteOptionMutationData.loading ||
    createOptionMutationData.loading;

  const isErrorOccurred = error ||
    updateOptionMutationData.error ||
    deleteOptionMutationData.error ||
    createOptionMutationData.error;

  return (
    <div className={classes.root}>
      <OptionsTable
        options={options ?? []}
        loading={isLoading}
        onAdd={() => setNewOption(true)}
        onEditOption={onEditOption}
        onDeleteOption={onDeleteOption}
      />
      {!!options && (
        <EditOption
          isLoading={isLoading}
          option={newOption ? defaultOptionVal : options.find(x => x.id === currentOption)}
          intents={intents ?? []}
          onEditOptionClose={onEditOptionClose}
          onSaveOption={onSaveOption}
          error={isErrorOccurred}
        />
      )}
    </div>
  );
};

export default Options;
