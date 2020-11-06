import { AgentConfig } from '@bavard/agent-config';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import 'firebase/auth';
import _ from 'lodash';
import React, {useState} from 'react';
import { useRecoilState } from 'recoil';
import { ConfirmDialog } from '../../../components';
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
  const [config, setConfig] = useRecoilState<AgentConfig | undefined>(currentAgentConfig);

  if (!config) {
    return <Typography>Agent config is empty.</Typography>;
  }

  const tags = config.getTagTypes();

  const onDeleteTagType = (tagType: string) => {
    const newConfig = _.cloneDeep<AgentConfig>(config);
    newConfig.deleteTagType(tagType);
    setConfig(newConfig);
  };

  return (
    <Paper className={classes.paper}>
      {tags ? (
        <TableContainer component={Paper} aria-label="Tags">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(tags).map((tag: string) => (
                <TableRow key={tag}>
                  <TableCell>
                    {tag}
                  </TableCell>
                  <TableCell>
                     <IconButton aria-label="delete" onClick={() => setConfirmOpen(true)}>
                        <DeleteIcon />
                     </IconButton>
                     <ConfirmDialog
                        title="Delete Tag?"
                        open={confirmOpen}
                        setOpen={setConfirmOpen}
                        onConfirm={() => onDeleteTagType(tag)}
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
