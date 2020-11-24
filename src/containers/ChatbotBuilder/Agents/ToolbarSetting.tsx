import { DropDown } from '@bavard/react-components';
import { makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import { IAgent } from '../../../models/chatbot-service';

interface ToolBarSettingProps {
  agents: IAgent[] | undefined;
  currentAgent: string | undefined;
  handleChange: (name: string) => void;
  saveAgent: () => void;
  publishAgent: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    padding: '7px 10px 5px 0px',
  },
  dropdown: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: '10px',
    paddingRight: '20px',
    borderRight: '1px solid gray',
  },
  button: {
    padding: '10px 5px',
    marginLeft: '0px',
    marginRight: '15px',
    cursor: 'pointer',
    color: '#0161FF',
  },
  buttonContent: {
    display: 'flex',
    flexFlow: 'flex-start',
    alignItems: 'center',
    padding: '5px',
  },
}));

export const ToolBarSetting = ({
  agents,
  currentAgent,
  handleChange,
  saveAgent,
  publishAgent,
}: ToolBarSettingProps) => {
  const classes = useStyles();

  const dropDownAgents = useMemo(() => {
    return (agents || []).map((agent) => ({
      id: agent.id,
      value: agent.uname,
    }));
  }, [agents]);

  return (
    <Toolbar className={classes.root} variant="dense">
      <div className={classes.dropdown}>
        <Typography className={classes.label}>Current Assistant : </Typography>
        {agents && (
          <DropDown
            label=""
            current={currentAgent || ''}
            menuItems={dropDownAgents}
            onChange={handleChange}
          />
        )}
      </div>
      <div className={classes.button}>
        <div onClick={saveAgent} className={classes.buttonContent}>
          <img
            src="/save.svg"
            alt="save"
            width="25px"
            height="25px"
            style={{ marginRight: '5px' }}
          />
          <div>Save Agent</div>
        </div>
      </div>
      <div className={classes.button}>
        <div onClick={publishAgent} className={classes.buttonContent}>
          <img
            src="/rocket.svg"
            alt="save"
            width="25px"
            height="25px"
            style={{ marginRight: '5px' }}
          />
          <div>Publish Assistant</div>
        </div>
      </div>
    </Toolbar>
  );
};
