import { ISlot } from '@bavard/agent-config';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import AddSlot from './AddSlot';
import EditSlot from './EditSlot';
import SlotsTable from './SlotsTable';

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
  const [currentSlot, setCurrentSlot] = useState<ISlot | undefined>();
  const [isNewSlot, setIsNewSlot] = useState<boolean>(false);
  const [config, setConfig] = useRecoilState(currentAgentConfig);

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const slots = config.getSlots();

  const onEditSlot = (slot: ISlot) => {
    setCurrentSlot(slot);
  };

  const onSaveSlot = async (slot: ISlot) => {
    config.deleteSlot(slot.name);
    config.addSlot(slot.name, slot.type);
    setConfig(config);
    setIsNewSlot(false);
    setCurrentSlot(undefined);
  };

  const onDeleteSlot = async (slot: ISlot) => {
    config.deleteSlot(slot.name);
    setConfig(config);
    setCurrentSlot(undefined);
  };

  const onEditSlotClose = () => {
    setCurrentSlot(undefined);
    setIsNewSlot(false);
  };

  return (
    <div className={classes.root}>
      <SlotsTable
        slots={slots ?? []}
        onAdd={() => setIsNewSlot(true)}
        onEditSlot={onEditSlot}
        onDeleteSlot={onDeleteSlot}
      />
      {!!slots && (
        <>
          <EditSlot
            slot={currentSlot}
            onEditSlotClose={onEditSlotClose}
            onSaveSlot={onSaveSlot}
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
