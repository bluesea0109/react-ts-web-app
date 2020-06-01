import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useParams } from 'react-router-dom';
import NewTemplate from './NewTemplate';
import TemplatesTable from './TemplatesTable';

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

const TemplateSection: React.FC = () => {
  const classes = useStyles();
  const { agentId } = useParams();

  return (
    <div className={classes.root}>
         <Grid item={true} xs={12} sm={12}>
            <NewTemplate />
          </Grid>
          <Grid item={true} xs={12} sm={12}>
            <Paper className={classes.paper}>
              {agentId ? (
                <TemplatesTable />
              ) : (
                <Typography>{'No Template is found'}</Typography>
              )}
            </Paper>
          </Grid>
          
    </div>
  );
};

export default TemplateSection;
