import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { IUser } from '../../../models';
import AgentsTable from './AgentsTable';
import NewAgent from './NewAgent';

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

interface IChatbotBuilderAgentProps {
  user: IUser;
}

const ChatbotBuilder: React.FC<IChatbotBuilderAgentProps> = ({ user }) => {
  const classes = useStyles();
  const activeProj = user.activeProject;

  return (
    <div className={classes.root}>
      <Grid>
          <Grid item={true} xs={12} sm={12}>
<<<<<<< HEAD
            <NewAgent user={user} />
          </Grid>
          <Grid item={true} xs={12} sm={12}>
=======
>>>>>>> 059037773fafdcf1186b35be1cc75427e78990bf
            <Paper>
              {activeProj ? (
                <AgentsTable />
              ) : (
<<<<<<< HEAD
                <Typography>{'No project is active'}</Typography>
              )}
            </Paper>
          </Grid>
=======
                <Typography>{'No Agent is found'}</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item={true} xs={12} sm={12}>
            <NewAgent user={user} />
          </Grid>
>>>>>>> 059037773fafdcf1186b35be1cc75427e78990bf
      </Grid>
    </div>
  );
};

export default ChatbotBuilder;
