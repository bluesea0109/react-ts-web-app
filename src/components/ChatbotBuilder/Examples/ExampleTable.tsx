import { Button, createStyles, makeStyles, Paper, TableContainer, Theme, Typography } from '@material-ui/core';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useParams } from 'react-router-dom';
import { CHATBOT_DELETE_EXAMPLE, CHATBOT_UPDATE_EXAMPLE, CREATE_EXAMPLE_TAGTYPES, GET_EXAMPLES } from '../../../common-gql-queries';
import {  IExample } from '../../../models/chatbot-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import TextHighlightator from './TextHighlightator';

interface IGetExamples {
  ChatbotService_examples: IExample[] | undefined;
}

interface IExampleTableProps {
    tagTypeId: number;
    intentId: number;
  }

  interface ExampleState {
    columns: Column<any>[];
    data: IExample[] | undefined;
  }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
    },
    selectionText: {
      border: 'none',
      outline: 'none',
      backgroundColor: '#f5f5f5',
    },
  }),
);

const ExampleTable: React.FC<IExampleTableProps> = ({tagTypeId, intentId}) => {
    const classes = useStyles();
    const { agentId } = useParams();
    const numAgentId  = Number(agentId);
    const examplesData = useQuery<IGetExamples>(GET_EXAMPLES, {variables: { agentId: numAgentId }});
    const [deleteExample, { loading, error }] = useMutation(CHATBOT_DELETE_EXAMPLE,  {
        refetchQueries: [{ query: GET_EXAMPLES, variables: { agentId: numAgentId }  }],
        awaitRefetchQueries: true,
      });
      const [updateExample, updatedData ] = useMutation(CHATBOT_UPDATE_EXAMPLE,  {
        refetchQueries: [{ query: GET_EXAMPLES, variables: { agentId: numAgentId }  }],
        awaitRefetchQueries: true,
      });
      const [createExampleTagType, updatedDataTag ] = useMutation(CREATE_EXAMPLE_TAGTYPES,  {
        refetchQueries: [{ query: GET_EXAMPLES, variables: { agentId: numAgentId }  }],
        awaitRefetchQueries: true,
      });
      const [singleExample, setSingleExample] = React.useState<IExample | null>();

      const examples: IExample[] | undefined = examplesData && examplesData.data &&
      examplesData.data.ChatbotService_examples;

      const submitExampleTag = () => {
        const selection = window.getSelection();
        let start;
        let end;
        if (selection && singleExample) {
          const selectedStr = selection.toString();
          start = singleExample.text.indexOf(selectedStr);
          end =  start + selectedStr.length;
      }

      if (singleExample && tagTypeId && start && end) {
        const exampleId = singleExample.id;
        createExampleTagType({
          variables: {
            exampleId, tagTypeId, start, end,
          },
        });
      }

    };

    const [state, setState] = React.useState<ExampleState>({
        columns: [
          { title: 'Example id', field: 'id', editable: 'never' },
          { title: 'Text',
            field: 'text',
            render: rowData => <TextHighlightator onMouseUp={() => setSingleExample(rowData)}
            rowData={rowData} />,
            editable: 'onUpdate',
          },
        ],
        data: examples,
      });

      useEffect(() => {
        if (examples) {
          setState({
            columns: state.columns,
            data : [...examples],
          });
        }

        return () => {};
      }, [examples, state.columns]);
      const commonError = examplesData.error ? examplesData.error : updatedData.error ? updatedData.error
      : updatedDataTag.error ? updatedDataTag.error : error;
    if (examplesData.loading || updatedData.loading || updatedDataTag.loading || loading ) {
        return <ContentLoading />;
      }

      if (commonError) {
        return <ApolloErrorPage error={commonError} />;
      }

      const deleteExampleHandler =  (exampleId: number) => {
        deleteExample({
           variables: {
            exampleId,
           },
         });
     };

     const updateExampleHandler =  (exampleId: number, text: string) => {
       updateExample({
          variables: {
            exampleId,
            text,
          },
        });
    };
    return (
        <Paper className={classes.paper}>
            {state && state.data && state.data.length > 0 ? (
        <TableContainer component={Paper} aria-label="Examples">
          <Button  variant="outlined" color="secondary" onClick={submitExampleTag}>
              Save Tags
          </Button>
          <MaterialTable
      title="Examples Table"
      columns={state.columns}
      data={state.data}
      options={{
        actionsColumnIndex: -1,
      }}

      localization={{
        body: {
          editRow: {
            deleteText : 'Are you sure delete this Example?',
          },
        },
      }}

      editable={{
        onRowUpdate: async (newData, oldData) => {
          if (oldData) {
            const dataId = oldData.id;
            const dataName = newData.text;
            updateExampleHandler(dataId, dataName);
          }
        },
        onRowDelete: async (oldData) => {
          const dataId = oldData.id;
          deleteExampleHandler(dataId);
        },
      }}
    />
        </TableContainer>
      ) : (
          <Typography align="center" variant="h6">
            {'No Examples found'}
          </Typography>
        )}
        </Paper>
    );
};

export default ExampleTable;
