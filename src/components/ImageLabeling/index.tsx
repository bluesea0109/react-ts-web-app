import { makeStyles, Grid, Typography, Toolbar, Theme, createStyles, Tab, Tabs, Paper } from '@material-ui/core';
import React from "react";
import Collections from './Collections';
import CreateCollection from './CreateCollection';
import { useActiveOrg } from '../UseActiveOrg';
import { useParams, useLocation, useHistory } from 'react-router';
import CategorySets from './CategorySets/CategorySets';

interface IProjectProps {
  orgId: string,
  projectId: string,
}

function ImageLabelingPageWrapper() {
  const { orgId, projectId } = useActiveOrg();

  if (!orgId) {
    return <Typography>{"No org is active."}</Typography>
  }
  if (!projectId) {
    return <Typography>{"No project is active."}</Typography>
  }

  return <ImageLabelingPage orgId={orgId} projectId={projectId} />
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
  })
);

function ImageLabelingPage(props: IProjectProps) {
  // eslint-disable-next-line
  const classes = useStyles();
  const { tab } = useParams();
  const history = useHistory();
  const location = useLocation();

  const handleChangeTab = (event: any, value: any) => {
    history.push({
      pathname: `/image-labeling/${value}`,
      search: location.search
    });
  };

  return (
    <div>
      <Paper>
        <Toolbar variant="dense" disableGutters={true}>
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
        <Grid container>
          <Grid item xs={12}>
            <Toolbar variant="dense" disableGutters={true}>
              <Typography variant="h6">
                {"Collections"}
              </Typography>
              <CreateCollection />
            </Toolbar>
          </Grid>
          <Grid container item xs={12}>
            <Collections />
          </Grid>
        </Grid>
      )}
      {tab === 'category-sets' && (
        <CategorySets/>
      )}
    </div>
  );
};

export default ImageLabelingPageWrapper;