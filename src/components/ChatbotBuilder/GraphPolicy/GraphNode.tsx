import { Card, CardContent, CardHeader, Chip, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MessageIcon from '@material-ui/icons/Message';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import {IGraphPolicyNode} from '../../../models/graph-policy';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    nodePaper: {
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.spacing(1),
      maxWidth: 300,
      // height: 150,
      textAlign: 'center',
      overflow: 'hidden',
      margin: theme.spacing(2),
    },
    chip: {
      margin: 2,
    },
    alert: {
      marginBottom: theme.spacing(1),
    },
  }),
);

interface IGraphNodeProps {
  node: IGraphPolicyNode;
  wrapperClassName?: string;
}

export default function GraphNode({node, wrapperClassName}: IGraphNodeProps) {
  const classes = useStyles();

  return (
      <Card className={`${classes.nodePaper} ${wrapperClassName}`}>
        <CardHeader title={
          <Typography variant="subtitle1">
            {node.nodeId}: {node.actionName} &nbsp;
            <Typography component="span" color="secondary" variant="subtitle2" align="right">
              {node.nodeType}
            </Typography>
          </Typography>
        }/>

        <CardContent>
          <Alert icon={<MessageIcon/>} severity="info" className={classes.alert}>
            {node.utterance}
          </Alert>

          {node.options?.map((o) => {
            return <Chip key={`${o.type}: ${o.intent}`} className={classes.chip} label={`${o.type}: ${o.intent}`} />;
          })}
        </CardContent>
      </Card>

  );
}
