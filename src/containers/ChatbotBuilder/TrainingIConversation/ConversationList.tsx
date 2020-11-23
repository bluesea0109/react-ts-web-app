import { IConversation } from '@bavard/agent-config/dist/conversations';
import { CollapsibleTable } from '@bavard/react-components';
import React from 'react';
import {
  Grid,
  Box,
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import ConversationPanel from './ConversationPanel';

import {
  Delete,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from '@material-ui/icons';

interface ConversationListProps {
  records: IConversation[];
  handleDelete: () => void;
  handleSave: () => void;
}

export const ConversationList = ({
  records,
  handleDelete,
  handleSave,
}: ConversationListProps) => {
  return (
    <Grid>
      <CollapsibleTable
        items={records}
        defaultCollapsed={true}
        onDeleteItem={handleDelete}
        ItemRow={ConversationHeader}
        ItemDetail={ConversationDetail}
      />
    </Grid>
  );
};

interface ConversationHeaderProps {
  index: number;
  isOpened: boolean;
  isCollapsed: boolean;
  onClickItem: () => void;
  handleDelete: (id: number) => void;
  onToggleCollapse: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
    },
    header: {
      padding: '4px 8px 4px 4px',
    },
  }),
);

interface ReceiveProps {
  agentId: number;
  id: number;
  conversation: IConversation;
  metadata: object;
}

interface IConversationDetailProps {
  item: ReceiveProps;
}

const ConversationDetail = ({ item }: IConversationDetailProps) => (
  <ConversationPanel conversation={item} />
);

const ConversationHeader = ({
  index,
  isCollapsed,
  isOpened,
  handleDelete,
  onClickItem,
  onToggleCollapse,
}: ConversationHeaderProps) => {
  const classes = useStyles();
  console.log('Is opened ', isOpened);
  return (
    <Grid
      container={true}
      className={classes.header}
      alignItems="center"
      onClick={() => onClickItem()}>
      <Grid item={true} container={true} xs={6} sm={6} alignItems="center">
        <Box mr={1}>
          {!isOpened ? (
            <KeyboardArrowRight
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
        </Box>
        <Typography style={{ textTransform: 'capitalize' }}>
          Conversation {index + 1}
        </Typography>
      </Grid>
      <Grid xs={4} sm={4}></Grid>
      <Grid item={true} container={true} xs={2} sm={2} justify="flex-end">
        <Box ml={1}>
          <Delete onClick={() => console.log('oka')} />
        </Box>
      </Grid>
    </Grid>
  );
};
