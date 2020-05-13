import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useParams, useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
  })
);


function ImageCollectionPage() {
  // eslint-disable-next-line
  const classes = useStyles(); 
  const { collectionId, tab } = useParams();
  const history = useHistory();
  const location = useLocation();

  const handleChangeTab = (event: any, value: any) => {
    history.push({
      pathname: `/image-labeling/collections/${collectionId}/${value}`,
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
            <Tab label="Images" value="images" />
            <Tab label="Review Queues" value="review-queues" />
          </Tabs>
        </Toolbar>

      </Paper>
      {tab === 'images' && (
        <Typography>{"Images"}</Typography>
        )}
      {tab === 'review-queues' && (
        <Typography>{"Review Queues"}</Typography>
      )}
    </div>
  );
};

export default ImageCollectionPage;
