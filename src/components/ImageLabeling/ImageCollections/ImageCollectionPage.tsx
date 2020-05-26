import { Link, Tabs, Toolbar, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import ImagesTable from './ImagesTable';
import ExportsTable from './LabelExports/ExportsTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

function ImageCollectionPage() {
  // eslint-disable-next-line
  const classes = useStyles();
  const { orgId, projectId, collectionId, tab } = useParams();
  const history = useHistory();

  const handleChangeTab = (event: any, value: any) => {
    history.push({
      pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/collections/${collectionId}/${value}`,
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
            <Tab label="Images" value="images" />
            <Tab label="Review Queues" value="review-queues" />
            <Tab label="Label Exports" value="label-exports" />
          </Tabs>
          <Typography className={classes.root}>
            <Link component={RouterLink} to={`/orgs/${orgId}/projects/${projectId}/image-labeling/collections/`}>
              {'All collections'}
            </Link>
          </Typography>
        </Toolbar>
      </Paper>
      {tab === 'images' && (
        <ImagesTable collectionId={parseInt(collectionId, 10)} />
      )}
      {tab === 'review-queues' && <Typography>{'Review Queues'}</Typography>}
      {tab === 'label-exports' && (
        <ExportsTable/>
      )}
    </div>
  );
}

export default ImageCollectionPage;
