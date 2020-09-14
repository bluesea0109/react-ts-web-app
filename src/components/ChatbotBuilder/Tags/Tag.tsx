import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import NewTag from './NewTag';
import TagsTable from './TagsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

const TagSection: React.FC = () => {
  const classes = useStyles();
  const [config] = useRecoilState(currentAgentConfig);

  if (!config) {
    return <Typography>Agent config is empty.</Typography>;
  }

  return (
    <div className={classes.root}>
      <Grid item={true} xs={12} sm={12}>
        <NewTag/>
      </Grid>
      <Grid item={true} xs={12} sm={12}>
        <Paper className={classes.paper}>
          <TagsTable/>
        </Paper>
      </Grid>
    </div>
  );
};

export default TagSection;
