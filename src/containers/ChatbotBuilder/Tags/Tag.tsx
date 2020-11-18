import { AgentConfig } from '@bavard/agent-config';
import { Grid, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import { useRecoilState } from 'recoil';
import { currentAgentConfig } from '../atoms';
import NewTag from './NewTag';
import TagsTable from './TagsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {      
      overflow: 'auto',
    },
    paper: {
      padding: theme.spacing(2),
    },
    pageTitle: {
      fontSize: '26px', 
      marginBottom: '24px'
    }
  }),
);

const TagSection: React.FC = () => {
  const classes = useStyles();
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(
    currentAgentConfig,
  );

  if (!config) {
    return <Typography>Agent config is empty.</Typography>;
  }

  const tagTypes = config.getTagTypes();

  const onDeleteTagType = (tag: string) => {
    const newConfig = _.cloneDeep<AgentConfig>(config);
    newConfig.deleteTagType(tag);
    setConfig(newConfig);
  };

  const onAddTagType = (tag: string) => {
    const newConfig = _.cloneDeep<AgentConfig>(config);
    newConfig.addTagType(tag);
    setConfig(newConfig);
  };

  return (
    <div className={classes.root}>
      <Grid item={true} xs={12} sm={12}>
        <Grid className={classes.pageTitle}>Tag Type Manager</Grid>
        <NewTag onAdd={onAddTagType} />
      </Grid>
      <Grid item={true} xs={12} sm={12}>
        <Paper className={classes.paper}>
          <TagsTable tagTypes={tagTypes} onDeleteTagType={onDeleteTagType} />
        </Paper>
      </Grid>
    </div>
  );
};

export default TagSection;
