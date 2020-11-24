import { BaseAgentAction, IIntent } from '@bavard/agent-config';
import { FilterBox } from '@bavard/react-components';
import {
  Box,
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import 'firebase/auth';
import React, { useState, useMemo } from 'react';
import IntentList from './IntentList';

interface IntentsTableProps {
  intents: IIntent[];
  actions: BaseAgentAction[];
  onAddIntent: () => void;
  onEditIntent: (intent: IIntent) => void;
  onDeleteIntent: (intent: IIntent) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    boldTypography: {
      fontWeight: 'bold',
    },
  }),
);

function IntentsTable({
  intents,
  onAddIntent,
  onEditIntent,
  onDeleteIntent,
}: IntentsTableProps) {
  const classes = useStyles();
  const [nameFilter, setNameFilter] = useState<string>('');

  const filteredIntents = useMemo(() => {
    return intents.filter((item) =>
      item.name.toLowerCase().includes(nameFilter.toLocaleLowerCase()),
    );
  }, [intents, nameFilter]);

  return intents.length ? (
    <Paper aria-label="Agents" className={classes.root}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        paddingBottom={2}>
        <Box flex="1">
          <Typography variant="h6">Intents</Typography>
          <Typography>
            Edit an intent below to add natural language examples of user
            queries. Add several examples to ensure that your Assistant will
            respond accurately.
          </Typography>
        </Box>
        <Box
          flex="1"
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-start">
          <Button variant="contained" color="primary" onClick={onAddIntent}>
            Add New Intent
          </Button>
        </Box>
      </Box>

      <Grid
        container={true}
        item={true}
        justify="space-between"
        alignItems="center">
        <Grid item={true} xs={6} sm={6}>
          <FilterBox
            name="Intent Name"
            filter={nameFilter}
            onChange={setNameFilter}
          />
        </Grid>
        <Grid item={true} xs={6} sm={6}>
          <Typography className={classes.boldTypography}>
            Default Action
          </Typography>
        </Grid>
      </Grid>

      <Grid container={true}>
        <IntentList
          intents={filteredIntents}
          onEditIntent={onEditIntent}
          onDeleteIntent={onDeleteIntent}
        />
      </Grid>
    </Paper>
  ) : (
    <Typography align="center" variant="h6">
      {'No Intents found'}
    </Typography>
  );
}

export default IntentsTable;
