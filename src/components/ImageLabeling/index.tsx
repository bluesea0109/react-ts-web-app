import { createStyles, Grid, makeStyles, Paper, Tab, Tabs, Theme, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { useActiveOrg } from '../UseActiveOrg';
import Collections from './Collections';
import CreateCollection from './CreateCollection';

interface IProjectProps {
  orgId: string;
  projectId: string;
}

function ImageLabelingPageWrapper() {
  const { orgId, projectId } = useActiveOrg();

  if (!orgId) {
    return <Typography>{'No org is active.'}</Typography>;
  }
  if (!projectId) {
    return <Typography>{'No project is active.'}</Typography>;
  }

  return <ImageLabelingPage orgId={orgId} projectId={projectId} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    toolbar: {
    },
    tabRoot: {
    },
  }),
);

function ImageLabelingPage(props: IProjectProps) {
  const classes = useStyles();
  const { tab } = useParams();
  const history = useHistory();
  const location = useLocation();

  const handleChangeTab = (event: any, value: any) => {
    history.push({
      pathname: `/image-labeling/${value}`,
      search: location.search,
    });
  };

  return (
    <div >
      <Paper className={classes.tabRoot}>
        <Toolbar variant="dense" disableGutters={true} className={classes.toolbar}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="primary"
          >
            <Tab value={'collections'} label="Image Collections" />
            <Tab value={'category-sets'} label="Category Sets" />
          </Tabs>
        </Toolbar>
      </Paper>
      {tab === 'collections' && (
        <Grid container={true}>
          <Grid item={true} xs={12}>
            <Toolbar variant="dense" disableGutters={true} className={classes.toolbar}>
              <Typography variant="h6">
                {'Collections'}
              </Typography>
              <CreateCollection />
            </Toolbar>
          </Grid>
          <Grid container={true} item={true} xs={12}>
            <Collections />
          </Grid>
        </Grid>
      )}
      {tab === 'category-sets' && (
        <Typography>
          {'Category Sets'}
        </Typography>
      )}
    </div>
  );
}

export default ImageLabelingPageWrapper;
