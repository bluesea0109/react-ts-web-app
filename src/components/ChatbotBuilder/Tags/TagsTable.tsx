import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import 'firebase/auth';
import React, {useState} from 'react';
import { useParams } from 'react-router';
import { CHATBOT_DELETE_TAG, CHATBOT_GET_TAGS } from '../../../common-gql-queries';
import { ITagType } from '../../../models';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import ConfirmDialog from '../../Utils/ConfirmDialog';

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

interface IGetTags {
  ChatbotService_tagTypes: ITagType[] | undefined;
}

function TagsTable() {
  const classes = useStyles();
  const { agentId } = useParams();
  const [confirmOpen, setConfirmOpen ] = useState(false);
  const numAgentId = Number(agentId);

  const tagsData = useQuery<IGetTags>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const [deleteTag, { loading, error }] = useMutation(CHATBOT_DELETE_TAG,  {
    refetchQueries: [{ query: CHATBOT_GET_TAGS, variables: { agentId : numAgentId }  }],
    awaitRefetchQueries: true,
  });

  const commonError = tagsData.error ? tagsData.error : error;

  if (tagsData.loading || loading) {
    return <ContentLoading />;
  }

  if ( commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  const deleteTagHandler =  (tagTypeId: number) => {
    deleteTag({
        variables: {
          tagTypeId,
        },
      });
  };

  const tags = tagsData.data && tagsData.data.ChatbotService_tagTypes;
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
