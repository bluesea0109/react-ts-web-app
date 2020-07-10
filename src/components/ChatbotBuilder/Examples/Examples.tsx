import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router';
import { CHATBOT_GET_TAGS } from '../../../common-gql-queries';
import {  ITagType } from '../../../models/chatbot-service';
import AutoComplete from '../../Utils/Autocomplete';
import CreateExamples from './CreateExamples';
import ExampleTable from './ExampleTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      overflow: 'auto',
    },
  }),
);

interface IGetTags {
  ChatbotService_tagTypes: ITagType[] | undefined;
}

const Examples = () => {
  const { agentId } = useParams();
  const numAgentId = Number(agentId);
  const tagsData = useQuery<IGetTags>(CHATBOT_GET_TAGS, { variables: { agentId: numAgentId } });
  const tags = tagsData.data && tagsData.data.ChatbotService_tagTypes;
  const [tagSelectedValue, setTagSelectedValue] = React.useState<any | null>(null);
  const [intentSelectedValue] = React.useState<any | null>(null);
  const classes = useStyles();

  useEffect(() => {
    if (tags) {
      setTagSelectedValue(tagSelectedValue ? tagSelectedValue : tags[0]);
    }

    return () => {
    };
  }, [intentSelectedValue, tagSelectedValue, tags]);

    return (
        <div className={classes.root}>
          <Grid container={true} spacing={1}>
          <Grid item={true} xs={12} sm={9}>
                  <CreateExamples />
                  <ExampleTable
                     tagTypeId={tagSelectedValue}
                     intentId={intentSelectedValue}
                   />

              </Grid>
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

        </Grid>
    </div>
    );
};

export default Examples;
