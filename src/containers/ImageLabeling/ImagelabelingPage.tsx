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

interface IProjectProps {
  orgId: string;
  projectId: string;
}

function ImageLabelingPageWrapper() {
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();

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
      paddingLeft: theme.spacing(2),
    },
  }),
);

function ImageLabelingPage(props: IProjectProps) {
  // eslint-disable-next-line
  const classes = useStyles();
  const { orgId, projectId, tab } = useParams<{
    orgId: string;
    projectId: string;
    tab: string;
  }>();
  const history = useHistory();

  const handleChangeTab = (event: any, value: any) => {
    history.push({
      pathname: `/orgs/${orgId}/projects/${projectId}/image-labeling/${value}`,
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
