import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import 'firebase/auth';
import React, {useState} from 'react';
import { useRecoilState } from 'recoil';
import { ITagType } from '../../../models/chatbot-service';
import ConfirmDialog from '../../Utils/ConfirmDialog';
import { currentAgentConfig } from '../atoms';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

function TagsTable() {
  const classes = useStyles();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [config, setConfig] = useRecoilState(currentAgentConfig);

  if (!config) {
    return <Typography>Agent config is empty.</Typography>;
  }

  const tags = config.getTagTypes();

  return (
    <Paper className={classes.paper}>
      {tags ? (
        <TableContainer component={Paper} aria-label="Tags">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Tag id</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((tag: ITagType) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    {tag.value}
                  </TableCell>
                  <TableCell>{tag.id}</TableCell>
                  <TableCell>
                     <IconButton aria-label="delete" onClick={() => setConfirmOpen(true)}>
                        <DeleteIcon />
                     </IconButton>
                     <ConfirmDialog
                        title="Delete Tag?"
                        open={confirmOpen}
                        setOpen={setConfirmOpen}
                        onConfirm={() => deleteTagHandler(tag.id)}
                     >
                        Are you sure you want to delete this tag?
                    </ConfirmDialog>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      ) : (
          <Typography align="center" variant="h6">
            {'No Tags found'}
          </Typography>
        )}
    </Paper>
  );
}

export default TagsTable;
