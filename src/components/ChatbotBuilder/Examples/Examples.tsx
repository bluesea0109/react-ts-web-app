import React from 'react'
import { Grid} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AutoComplete from '../../Utils/Autocomplete';
import ExampleTable from './ExampleTable';
import CreateExamples from './CreateExamples';
import { IIntent, ITagType } from '../../../models';
import { useQuery } from 'react-apollo';
import { CHATBOT_GET_INTENTS, CHATBOT_GET_TAGS } from '../../../common-gql-queries';
import { useParams } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
    }
  }),
);

interface IGetIntents {
  ChatbotService_intents: IIntent[] | undefined;
}
interface IGetTags {
  ChatbotService_tagTypes: ITagType[] | undefined;
}

const Examples = () => {
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const intentsData = useQuery<IGetIntents>(CHATBOT_GET_INTENTS, { variables: { agentId: numAgentId } });
  const intents = intentsData.data && intentsData.data.ChatbotService_intents;
  const tagsData = useQuery<IGetTags>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const tags = tagsData.data && tagsData.data.ChatbotService_tagTypes;
  const [tagSelectedValue, setTagSelectedValue] = React.useState<any | null>(tags ? tags[0] : null);
  const [intentSelectedValue, setIntentSelectedValue] = React.useState<any | null>(intents ? intents[0].id : null);
  const classes = useStyles();

    return (
        <div className={classes.root}>
           <Grid container spacing={1}>
              <Grid item={true} xs={12} sm={3}>
                 <AutoComplete
                    options={tags}
                    value={tagSelectedValue}
                    label="Tag Types"
                    onChange={(event: any, newValue: any | null) => {
                        setTagSelectedValue(newValue.id);
                        }
                    }
                  />
              </Grid>
              <Grid item={true} xs={12} sm={6}>
                  <CreateExamples intentId={intentSelectedValue} />
                  <ExampleTable
                     tagTypeId={tagSelectedValue}
                     intentId={intentSelectedValue}
                   />

              </Grid>
              <Grid item={true} xs={12} sm={3}>
              <AutoComplete
                    options={intents}
                    value={intentSelectedValue}
                    label="Intents"
                    onChange={(event: any, newValue: any | null) => {
                        setIntentSelectedValue(newValue.id);
                        }
                    }
                  />
              </Grid>
        </Grid>
    </div>
    )
}

export default Examples;