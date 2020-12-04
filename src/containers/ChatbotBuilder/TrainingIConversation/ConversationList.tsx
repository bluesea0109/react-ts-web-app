import { ITrainingConversation } from '../../../models/chatbot-service';
import { CollapsibleTable } from '@bavard/react-components';
import React from 'react';
import {
  Grid,
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import ConversationPanel from './ConversationPanel';

import {
  Delete,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from '@material-ui/icons';

interface ConversationListProps {
  conversations: ITrainingConversation[];
  onDelete: (conversation: ITrainingConversation) => void;
  onSave: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onDelete,
}: ConversationListProps) => {
  return (
    <Grid>
      <CollapsibleTable
        items={conversations}
        defaultCollapsed={true}
        isMultiExpandable={false}
        onDeleteItem={onDelete}
        ItemHeader={ConversationHeader}
        ItemDetail={ConversationDetail}
      />
    </Grid>
  );
};

interface ConversationHeaderProps {
  item: ITrainingConversation;
  isCollapsed: boolean;
  onClickItem: () => void;
  onDeleteRow: (item: ITrainingConversation) => void;
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
  item: conversation,
  isCollapsed,
  onDeleteRow,
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
          {`Conversation ${conversation.id}`}
        </Typography>
      </Grid>
      <Grid item={true} container={true} xs={4} justify="flex-end">
        <Delete onClick={() => onDeleteRow(conversation)} />
      </Grid>
    </Grid>
  );
};

export default ConversationList;
