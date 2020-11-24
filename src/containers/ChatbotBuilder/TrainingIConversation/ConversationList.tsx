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
  conversations: IConversation[];
  onDelete: () => void;
  onSave: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onDelete,
  onSave,
}: ConversationListProps) => {
  return (
    <Grid>
      <CollapsibleTable
        items={conversations}
        defaultCollapsed={true}
        onDeleteItem={onDelete}
        ItemHeader={ConversationHeader}
        ItemDetail={ConversationDetail}
      />
    </Grid>
  );
};

interface ConversationHeaderProps {
  isNew?: boolean;
  index?: number;
  isCollapsed: boolean;
  onClickItem: () => void;
  onDelete: () => void;
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

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  isNew,
  index,
  isCollapsed,
  onDelete,
  onClickItem,
  onToggleCollapse,
}) => {
  const classes = useStyles();
  return (
    <Grid
      container={true}
      className={classes.header}
      alignItems="center"
      onClick={() => onClickItem()}>
      <Grid item={true} container={true} xs={6} sm={6} alignItems="center">
        <Box mr={1}>
          {!isCollapsed ? (
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
          {isNew ? 'New Conversation' : `Conversation {${(index || 0) + 1}`}
        </Typography>
      </Grid>
      <Grid xs={4} sm={4}></Grid>
      <Grid item={true} container={true} xs={2} sm={2} justify="flex-end">
        <Box ml={1}>
          <Delete onClick={onDelete} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ConversationList;
