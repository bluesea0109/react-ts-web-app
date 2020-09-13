import { useMutation, useQuery } from '@apollo/client';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ISlot } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';
import AddSlot from './AddSlot';
import EditSlot from './EditSlot';
import { deleteSlotMutation, getSlotsQuery, updateSlotMutation } from './gql';
import SlotsTable from './SlotsTable';
import { GetSlotsQueryResult } from './types';

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

const SlotSection: React.FC = () => {
  const classes = useStyles();
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const [currentSlot, setCurrentSlot] = useState<Maybe<number>>();
  const [isNewSlot, setIsNewSlot] = useState(false);

  const { data, loading, error } = useQuery<GetSlotsQueryResult>(
    getSlotsQuery,
    {
      variables: { agentId: numAgentId },
    },
  );

  const [updateSlot, updateSlotMutationData] = useMutation(updateSlotMutation, {
    refetchQueries: [
      { query: getSlotsQuery, variables: { agentId: numAgentId } },
    ],
    awaitRefetchQueries: true,
  });

  const [deleteSlot, deleteSlotMutationData] = useMutation(deleteSlotMutation, {
    refetchQueries: [
      { query: getSlotsQuery, variables: { agentId: numAgentId } },
    ],
    awaitRefetchQueries: true,
  });

  const slots: Maybe<ISlot[]> = data?.ChatbotService_getSlots;

  const onEditSlot = (id: number) => {
    setCurrentSlot(id);
  };

  const onSaveSlot = async (slotData: ISlot) => {
    await updateSlot({
      variables: {
        id: slotData.id,
        name: slotData.name,
        type: slotData.type,
      },
    });

    setCurrentSlot(null);
    setIsNewSlot(false);
  };

  const onDeleteSlot = async (slotId: number) => {
    await deleteSlot({
      variables: {
        slotId,
      },
    });
  };

  const onEditSlotClose = () => {
    setCurrentSlot(null);
    setIsNewSlot(false);
  };

  const isLoading =
    loading ||
    updateSlotMutationData.loading ||
    deleteSlotMutationData.loading;

  const isErrorOccurred =
    error ||
    updateSlotMutationData.error ||
    deleteSlotMutationData.error;

  return (
    <div className={classes.root}>
      <SlotsTable
        slots={slots ?? []}
        loading={isLoading}
        onAdd={() => setIsNewSlot(true)}
        onEditSlot={onEditSlot}
        onDeleteSlot={onDeleteSlot}
      />
      {!!slots && (
        <>
          <EditSlot
            isLoading={isLoading}
            slot={slots.find((x) => x.id === currentSlot)}
            onEditSlotClose={onEditSlotClose}
            onSaveSlot={onSaveSlot}
            error={isErrorOccurred}
          />
          {isNewSlot && (
            <AddSlot
              onAddSlotClose={onEditSlotClose}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SlotSection;
