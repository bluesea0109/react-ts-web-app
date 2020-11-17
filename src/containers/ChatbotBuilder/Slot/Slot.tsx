import { AgentConfig, ISlot } from '@bavard/agent-config';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import AddSlot from './AddSlot';
import EditSlot from './EditSlot';
import SlotsTable from './SlotsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {      
      overflow: 'auto',
    },
    paper: {
      padding: theme.spacing(2),
    },
    pageTitle: {
      fontSize: '26px', 
      marginBottom: '24px'
    }
  }),
);

const SlotSection: React.FC = () => {
  const classes = useStyles();
  const [currentSlot, setCurrentSlot] = useState<ISlot | undefined>();
  const [isNewSlot, setIsNewSlot] = useState<boolean>(false);
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(
    currentAgentConfig,
  );

  if (!config) {
    return <p>Agent config is empty.</p>;
  }

  const slots = config.getSlots();

  const onEditSlot = (slot: ISlot) => {
    setCurrentSlot(slot);
  };

  const onSaveSlot = (slot: ISlot) => {
    if (!currentSlot) {
      return;
    }
    const newConfig = _.cloneDeep<AgentConfig>(config);
    newConfig.deleteSlot(currentSlot.name).addSlot(slot.name, slot.type);
    setConfig(newConfig);

    setIsNewSlot(false);
    setCurrentSlot(undefined);
  };

  const onDeleteSlot = (slot: ISlot) => {
    const newConfig = _.cloneDeep<AgentConfig>(config);
    newConfig.deleteSlot(slot.name);
    setConfig(newConfig);

    setCurrentSlot(undefined);
  };

  const onEditSlotClose = () => {
    setCurrentSlot(undefined);
    setIsNewSlot(false);
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.pageTitle}>Slot Values</Grid>
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
          {isNewSlot && <AddSlot onAddSlotClose={onEditSlotClose} />}
        </>
      )}
    </div>
  );
};

export default SlotSection;
