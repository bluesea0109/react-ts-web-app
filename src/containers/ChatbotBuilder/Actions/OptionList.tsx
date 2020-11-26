import { IIntent, IResponseOption } from '@bavard/agent-config';
import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { CollapsibleTable } from '@bavard/react-components';
import React from 'react';
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

interface ItemHeaderProps {
  item: IResponseOption;
  index: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface ItemDetailProps {
  item: IResponseOption;
  index: number;
  option: IResponseOption;
  onUpdateRow: (index: number, item: IResponseOption) => void;
  onDeleteRow: (index: number) => void;
  otherProps: { intents: IIntent[] };
}

interface OptionListProps {
  intents: IIntent[];
  options: IResponseOption[];
  onBulkUpdate: (options: IResponseOption[]) => void;
}

const OptionHeader: React.FC<ItemHeaderProps> = ({
  index,
  isCollapsed,
  onToggleCollapse,
}) => {
  const classes = useStyles();

  return (
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
  );
};

const OptionDetail = ({
  item,
  index,
  onUpdateRow,
  onDeleteRow,
  otherProps,
}: ItemDetailProps) => (
  <EditOption
    option={item}
    onUpdateOption={(option) => onUpdateRow(index, option)}
    onDeleteOption={() => onDeleteRow(index)}
    intents={otherProps.intents}
  />
);

const OptionList = ({ intents, options, onBulkUpdate }: OptionListProps) => {
  const onUpdateOption = (index: number, option: IResponseOption) =>
    onBulkUpdate([
      ...options.slice(0, index),
      option,
      ...options.slice(index + 1),
    ]);

  const onDeleteOption = (index: number) =>
    onBulkUpdate([...options.filter((_, id) => id !== index)]);

  return (
    <CollapsibleTable
      items={options}
      onUpdateItem={onUpdateOption}
      onDeleteItem={onDeleteOption}
      defaultCollapsed={false}
      otherProps={{ intents }}
      ItemHeader={OptionHeader}
      ItemDetail={OptionDetail}
    />
  );
};

export default OptionList;
