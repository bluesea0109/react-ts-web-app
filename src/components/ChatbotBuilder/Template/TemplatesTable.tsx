import { useMutation, useQuery } from '@apollo/react-hooks';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import 'firebase/auth';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { CHATBOT_DELETE_TEMPLATE, CHATBOT_GET_TEMPLATES } from '../../../common-gql-queries';
import { ITemplate } from '../../../models';
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

interface IGetTemplates {
  ChatbotService_templates: ITemplate[] | undefined;
}

function TagsTable() {
  const classes = useStyles();
  const { agentId } = useParams();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const numAgentId = Number(agentId);

  const templatesData = useQuery<IGetTemplates>(CHATBOT_GET_TEMPLATES, { variables: { agentId: numAgentId } });
  const [deleteTemplate, { loading, error }] = useMutation(CHATBOT_DELETE_TEMPLATE, {
    refetchQueries: [{ query: CHATBOT_GET_TEMPLATES, variables: { agentId: numAgentId } }],
    awaitRefetchQueries: true,
  });

  const commonError = templatesData.error ? templatesData.error : error;

  if (templatesData.loading || loading) {
    return <ContentLoading />;
  }

  if (commonError) {
    // TODO: handle errors
    return <ApolloErrorPage error={commonError} />;
  }

  const deleteTemplateHandler = (templateId: number) => {
    deleteTemplate({
      variables: {
        templateId,
      },
    });
  };

  const templates = templatesData.data?.ChatbotService_templates;
  return (
    <Paper className={classes.paper}>
      {templates ? (
        <TableContainer component={Paper} aria-label="Templates">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Text</TableCell>
                <TableCell>Template id</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template: ITemplate) => (
                <TableRow key={template.id}>
                  <TableCell>
                    {template.name}
                  </TableCell>
                  <TableCell>{template.text}</TableCell>
                  <TableCell>{template.id}</TableCell>
                  <TableCell>
                    <IconButton aria-label="delete" onClick={() => setConfirmOpen(true)}>
                      <DeleteIcon />
                    </IconButton>
                    <ConfirmDialog
                      title="Delete Template?"
                      open={confirmOpen}
                      setOpen={setConfirmOpen}
                      onConfirm={() => deleteTemplateHandler(template.id)}

                    >
                      Are you sure you want to delete this template?
                    </ConfirmDialog>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      ) : (
          <Typography align="center" variant="h6">
            {'No Templates found'}
          </Typography>
        )}
    </Paper>
  );
}

export default TagsTable;
