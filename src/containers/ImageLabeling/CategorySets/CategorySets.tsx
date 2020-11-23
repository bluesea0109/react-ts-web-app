import { useQuery } from '@apollo/client';
import { CommonTable } from '@bavard/react-components';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { useParams } from 'react-router';
import { GET_CATEGORY_SETS } from '../../../common-gql-queries';
import ContentLoading from '../../ContentLoading';
import CreateCategorySetDialog from './CreateCategorySetDialog';
import DeleteCategorySetDialog from './DeleteCategorySetDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      paddingLeft: theme.spacing(2),
    },
    list: {
      overflow: 'auto',
      maxHeight: 100,
    },
  }),
);

function CategorySets() {
  const classes = useStyles();
  const { projectId } = useParams<{ projectId: string }>();
  const categorySets = useQuery(GET_CATEGORY_SETS, {
    variables: { projectId },
  });
  if (categorySets.loading) {
    return <ContentLoading />;
  }

  if (categorySets.error) {
    console.error(categorySets.error);
    return <Typography>{'Unknown error occurred'}</Typography>;
  }

  const catSets = categorySets.data.ImageLabelingService_categorySets;

  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Id', field: 'id' },
    {
      title: 'Categories',
      field: 'categories',
      renderRow: (rowData: any) => (
        <List className={classes.list}>
          {rowData.categories.map((cat: any, i: number) => (
            <ListItem key={i}>
              <ListItemText primary={cat.name} />
            </ListItem>
          ))}
        </List>
      ),
    },
    {
      title: 'Delete',
      renderRow: (rowData: any) => (
        <DeleteCategorySetDialog
          name={rowData.name}
          categorySetId={rowData.id}
        />
      ),
    },
  ];
  return (
    <CommonTable
      data={{
        columns,
        rowsData: catSets,
      }}
      components={{
        Toolbar: () => (
          <Toolbar
            variant="dense"
            disableGutters={true}
            className={classes.toolbar}>
            <Typography variant="h6">{'Category Sets'}</Typography>
            <Typography style={{ padding: 2 }} />
            <CreateCategorySetDialog />
          </Toolbar>
        ),
      }}
    />
  );
}

export default CategorySets;
