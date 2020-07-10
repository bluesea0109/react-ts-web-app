import { Button, createStyles, makeStyles, Paper, TableContainer, Theme, Typography } from '@material-ui/core';
import MaterialTable, { Column } from 'material-table';
import React, { useEffect } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { useParams } from 'react-router-dom';
import { CHATBOT_DELETE_EXAMPLE, CHATBOT_UPDATE_EXAMPLE, CREATE_EXAMPLE_TAGS, GET_EXAMPLES } from '../../../common-gql-queries';
import {  IExample, IIntent } from '../../../models/chatbot-service';
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
    columns: Column<IExample>[];
    data: IExample[] | undefined;
  }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
      border: `1px solid #000`,
      marginBottom: theme.spacing(2),
      borderRadius: `4px`,
      position: `relative`,
    },
    selectionText: {
      border: 'none',
      outline: 'none',
      backgroundColor: '#f5f5f5',
    },
    label: {
      position: `absolute`,
      top: `-26px`,
      left: `20px`,
      background: `white`,
      padding: `0px 5px`,
    },
  }),
);

const ExampleTable: React.FC<IExampleTableProps> = ({tagTypeId}) => {
    const classes = useStyles();
    const { agentId } = useParams();
    const numAgentId  = Number(agentId);
    const examplesData = useQuery<any>(GET_EXAMPLES, {variables: { agentId: numAgentId }});
    const [deleteExample, { loading, error }] = useMutation(CHATBOT_DELETE_EXAMPLE,  {
        refetchQueries: [{ query: GET_EXAMPLES, variables: { agentId: numAgentId }  }],
        awaitRefetchQueries: true,
      });
      const [updateExample, updatedData ] = useMutation(CHATBOT_UPDATE_EXAMPLE,  {
        refetchQueries: [{ query: GET_EXAMPLES, variables: { agentId: numAgentId }  }],
        awaitRefetchQueries: true,
      });
      const [createExampleTagType, updatedDataTag ] = useMutation(CREATE_EXAMPLE_TAGS,  {
        refetchQueries: [{ query: GET_EXAMPLES, variables: { agentId: numAgentId }  }],
        awaitRefetchQueries: true,
      });
      const [singleExample, setSingleExample] = React.useState<IExample | null>();
      const examples: IExample[] | undefined = examplesData && examplesData.data &&
      examplesData.data.ChatbotService_examples;
      const intents: IIntent[] | undefined = examplesData && examplesData.data &&
      examplesData.data.ChatbotService_intents;

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

    const getMargeIntentData = (examplesData: any[], intentsData: any[]) => {
      const mergedData = examplesData.map((singleExample: any) => {
           const intent = intentsData.filter((intnt) => intnt.id ===  singleExample.intentId);
           return {
             ...singleExample,
             intentName: intent[0].value,
           };
      });
      return mergedData;

    };

    const arrayToObj = (intntData: any[]) => {
      const elements: any = {};
      intntData.forEach(({id, value}) => {
        elements[id] = value;
      });

      return elements;

    };

    const [state, setState] = React.useState<ExampleState>({
        columns: [
          { title: 'Intent',
          field: 'intentId',
          render: (rowData) => <span>{rowData.intentName}</span>,
          editable: 'never',
          customFilterAndSearch: (term, rowData) => {
            if (term.length > 0) {
              return Number(term[0]) === rowData.intentId;
            } else {
              return true;
            }

          },
          lookup: { 1: 'İstanbul', 2: 'Şanlıurfa' },
         },
          { title: 'Text',
            field: 'text',
            render: rowData => <TextHighlightator onSelectExample={() => setSingleExample(rowData)}
            example={rowData} />,
            editable: 'onUpdate',
            filtering: false,
          },
        ],
        data: examples,
      });

      useEffect(() => {
        if (examples && intents) {
          const updatedData = getMargeIntentData(examples, intents);
          state.columns[0].lookup = arrayToObj(intents);
          setState({
            columns: state.columns,
            data : [...updatedData],
          });
        }

        return () => {};
      }, [examples, intents,  state.columns]);

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
          <p className={classes.label}>NLU Example Tables</p>
            {state && state.data && state.data.length ? (
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
        filtering: true,
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
