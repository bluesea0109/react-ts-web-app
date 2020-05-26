import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { IUser } from '../../models';
import NewAgent from './NewAgent';
import AgentsTable from './AgentsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

interface IChatbotBuilderProps {
  user: IUser;
}

const ChatbotBuilder: React.FC<IChatbotBuilderProps> = ({ user }) => {
  const classes = useStyles();
  const activeProj = user.activeProject;

  return (
    <div className={classes.root}>
      <Grid>
      <Grid item={true} xs={12} sm={6}>
            <Paper>
              {activeProj ? (
                <AgentsTable
                  activeProj={activeProj}
                />
              ) : (
                <Typography>{'No Agent is found'}</Typography>
              )}
            </Paper>
          </Grid>
        <Grid item={true} xs={12} sm={6}>
          <NewAgent user={user} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatbotBuilder;
