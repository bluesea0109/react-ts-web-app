import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import CategorySets from './CategorySets/CategorySets';
import Collections from './Collections';

function ImageLabelingPageWrapper() {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  if (!workspaceId) {
    return <Typography>{'No workspace is active.'}</Typography>;
  }
  return <ImageLabelingPage workspaceId={workspaceId} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    toolbar: {
      paddingLeft: theme.spacing(2),
    },
  }),
);

function ImageLabelingPage() {
  // eslint-disable-next-line
  const classes = useStyles();
  const { workspaceId, tab } = useParams<{
    workspaceId: string;
    tab: string;
  }>();
  const history = useHistory();

  const handleChangeTab = (event: any, value: any) => {
    history.push({
      pathname: `/workspaces/${workspaceId}/image-labeling/${value}`,
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
            textColor="primary">
            <Tab value={'collections'} label="Image Collections" />
            <Tab value={'category-sets'} label="Category Sets" />
          </Tabs>
        </Toolbar>
      </Paper>
      {tab === 'collections' && (
        <Grid container={true}>
          <Collections />
        </Grid>
      )}
      {tab === 'category-sets' && <CategorySets />}
    </div>
  );
}

export default ImageLabelingPageWrapper;
