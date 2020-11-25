import { ITrainingConversation } from '../../../models/chatbot-service';
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
  conversations: ITrainingConversation[];
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
  index: number;
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

interface IConversationDetailProps {
  item: ITrainingConversation;
}

const ConversationDetail = ({ item }: IConversationDetailProps) => (
  <ConversationPanel conversation={item} />
);

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  index,
  isCollapsed,
  onDelete,
  onToggleCollapse,
}) => {
  const classes = useStyles();
  return (
    <Grid container={true} className={classes.header} alignItems="center">
      <Grid item={true} container={true} xs={8} alignItems="center">
        {isCollapsed ? (
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
        <Typography style={{ textTransform: 'capitalize' }}>
          {`Conversation ${(index || 0) + 1}`}
        </Typography>
      </Grid>
      <Grid item={true} container={true} xs={4} justify="flex-end">
        <Delete onClick={onDelete} />
      </Grid>
    </Grid>
  );
};

export default ConversationList;
