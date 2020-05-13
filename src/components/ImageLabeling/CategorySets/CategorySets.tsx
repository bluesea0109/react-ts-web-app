import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ContentLoading from '../../ContentLoading';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useQuery } from '@apollo/client';
import { GET_CATEGORY_SETS } from '../../../gql-queries';
import { useActiveOrg } from '../../UseActiveOrg';
import CreateCategorySetDialog from './CreateCategorySetDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
    toolbar: {
      paddingLeft: theme.spacing(1)
    },
    list: {
      overflow: 'auto',
      maxHeight: 100,
    },
  })
);


function CategorySets() {
  const classes = useStyles();
  const { projectId } = useActiveOrg();
  const categorySets = useQuery(GET_CATEGORY_SETS, { variables: { projectId, } });
  if (categorySets.loading) {
    return <ContentLoading />
  }

  if (categorySets.error) {
    console.error(categorySets.error);
    return <Typography>{"Unknown error occurred"}</Typography>;
  }

  const catSets = categorySets.data.ImageLabelingService_categorySets;
  console.log('catSets', catSets);
  return (
    <Grid container className={classes.root}>
      <Toolbar variant="dense" disableGutters={true} className={classes.toolbar}>
        <Typography variant="h6">
          {"Category Sets"}
        </Typography>
        <Typography style={{ padding: 2 }} />
        <CreateCategorySetDialog />
      </Toolbar>
      <Grid container item xs={12}>
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
                    {/* <CategorySetDelete categorySet={set} refetch={refetch} /> */}
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
