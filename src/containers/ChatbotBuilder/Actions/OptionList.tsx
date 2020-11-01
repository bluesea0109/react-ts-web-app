import { IIntent, IResponseOption } from '@bavard/agent-config';
import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import React from 'react';
import { CollapsibleTable } from '../../../components';
import EditOption from './EditOption';

const useStyles = makeStyles((_) =>
  createStyles({
    paper: {
      width: '100%',
    },
    header: {
      padding: '4px 8px 4px 4px',
    },
  }),
);

interface ItemRowProps {
  item: IResponseOption;
  index: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface ItemDetailProps {
  item: IResponseOption;
  index: number;
  intents: IIntent[];
  option: IResponseOption;
  onBulkUpdate: (options: IResponseOption[]) => void;
}

interface OptionListProps {
  intents: IIntent[];
  options: IResponseOption[];
  onBulkUpdate: (options: IResponseOption[]) => void;
}

const OptionList = ({ intents, options, onBulkUpdate }: OptionListProps) => {
  const classes = useStyles();

  return (
    <CollapsibleTable
      items={options}
      onBulkUpdate={onBulkUpdate}
      defaultCollapsed={false}
      ItemRow={({ index, isCollapsed, onToggleCollapse }: ItemRowProps) => (
        <Grid container={true} alignItems="center" className={classes.header}>
          <Grid item={true} container={true} xs={6} alignItems="center">
            <Typography>{`Option ${index + 1}`}</Typography>
          </Grid>
          <Grid item={true} container={true} xs={6} justify="flex-end">
            {isCollapsed ? (
              <KeyboardArrowUp
                color="primary"
                fontSize="large"
                onClick={onToggleCollapse}
              />
            ) : (
              <KeyboardArrowDown
                color="primary"
                fontSize="large"
                onClick={onToggleCollapse}
              />
            )}
          </Grid>
        </Grid>
      )}
      ItemDetail={({ item, index, onBulkUpdate }: ItemDetailProps) => (
        <EditOption
          option={item}
          intents={intents}
          onEditOption={(option: IResponseOption) =>
            onBulkUpdate([
              ...options.slice(0, index),
              option,
              ...options.slice(index + 1),
            ])
          }
          onDeleteOption={() =>
            onBulkUpdate([
              ...options.slice(0, index),
              ...options.slice(index + 1),
            ])
          }
        />
      )}
    />
  );
};

export default OptionList;
