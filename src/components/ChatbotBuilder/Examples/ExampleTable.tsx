import React, { useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo';
import { GET_EXAMPLES, CHATBOT_DELETE_EXAMPLE, CHATBOT_UPDATE_EXAMPLE } from '../../../common-gql-queries';
import {  IExample } from '../../../models/chatbot-service';
import ContentLoading from '../../ContentLoading';
import ApolloErrorPage from '../../ApolloErrorPage';
import { makeStyles, Theme, createStyles, Paper, TableContainer, Typography } from '@material-ui/core';
import MaterialTable, { Column } from 'material-table';

interface IGetExamples {
    ChatbotService_intentExamples: IExample[] | undefined;
}

interface IExampleTableProps {
    tagTypeId: number;
    intentId:number;
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
  }),
);

const ExampleTable: React.FC<IExampleTableProps> = ({tagTypeId, intentId}) => {
    const classes = useStyles();
    const examplesData = useQuery<IGetExamples>(GET_EXAMPLES, {variables: { intentId }});
    const [deleteExample, { loading, error }] = useMutation(CHATBOT_DELETE_EXAMPLE,  {
        refetchQueries: [{ query: GET_EXAMPLES, variables: { intentId }  }],
        awaitRefetchQueries: true,
      });
      const [updateExample, updatedData ] = useMutation(CHATBOT_UPDATE_EXAMPLE,  {
        refetchQueries: [{ query: GET_EXAMPLES, variables: { intentId }  }],
        awaitRefetchQueries: true,
      });
    const examples: IExample[] | undefined = examplesData && examplesData.data && examplesData.data.ChatbotService_intentExamples;

    const [state, setState] = React.useState<ExampleState>({
        columns: [
          { title: 'Example id', field: 'id', editable: 'never' },
          { title: 'Text',
             field: 'text',
             editable: 'onUpdate',
          }
        ],
        data: examples
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
      const commonError = examplesData.error ? examplesData.error : updatedData.error ? updatedData.error : error;
    if (examplesData.loading || updatedData.loading || loading ) {
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
    )
}

export default ExampleTable;
