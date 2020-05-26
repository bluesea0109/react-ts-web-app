import { useQuery } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { useParams } from 'react-router';
import { GET_CATEGORY_SETS } from '../../../gql-queries';
import ContentLoading from '../../ContentLoading';
import CreateCategorySetDialog from './CreateCategorySetDialog';
import DeleteCategorySetDialog from './DeleteCategorySetDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
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
  const { projectId } = useParams();
  const categorySets = useQuery(GET_CATEGORY_SETS, { variables: { projectId } });
  if (categorySets.loading) {
    return <ContentLoading />;
  }

  if (categorySets.error) {
    console.error(categorySets.error);
    return <Typography>{'Unknown error occurred'}</Typography>;
  }

  const catSets = categorySets.data.ImageLabelingService_categorySets;
  return (
    <Grid container={true} className={classes.root}>
      <Toolbar
        variant="dense"
        disableGutters={true}
        className={classes.toolbar}
      >
        <Typography variant="h6">{'Category Sets'}</Typography>
        <Typography style={{ padding: 2 }} />
        <CreateCategorySetDialog />
      </Toolbar>
      <Grid container={true} item={true} xs={12}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Id</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {catSets.map((set: any, i: number) => {
              return (
                <TableRow key={i} hover={true}>
                  <TableCell component="th" scope="row">
                    {set.name}
                  </TableCell>
                  <TableCell>{set.id}</TableCell>
                  <TableCell>
                    <List className={classes.list}>
                      {set.categories.map((cat: any, i: number) => (
                        <ListItem key={i}>
                          <ListItemText primary={cat.name} />
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell>
                    <DeleteCategorySetDialog
                      name={set.name}
                      categorySetId={set.id}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}

export default CategorySets;
