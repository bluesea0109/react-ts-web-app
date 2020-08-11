import { GraphPolicyNode, ImageOption, IOutEdge} from '@bavard/graph-policy';
import { Avatar, Card, CardActions, CardContent, IconButton, Paper, Tooltip, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {Add, ContactSupport, Delete, Edit, Email, NotInterested, TextFields} from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import _ from 'lodash';
import React, { useContext } from 'react';
import {OptionImagesContext} from '../../../context/OptionImages';
import EdgeChip from './EdgeChip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },
    nodePaper: {
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.spacing(1),
      minWidth: 180,
      maxWidth: 300,
      textAlign: 'center',
      overflow: 'hidden',
    },
    optionContainer: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    option: {
      height: 30,
      display: 'flex',
      backgroundColor: theme.palette.background.paper,
      fontSize: 11,
      padding: 2,
      margin: 2,
      borderRadius: theme.spacing(1),
      alignItems: 'center',
    },
    optionText: {
      padding: theme.spacing(1),
    },
    optionImg: {
      height: 30,
      width: 30,
    },
    alert: {
      marginBottom: theme.spacing(1),
    },
    utteranceText: {
      maxHeight: 95,
      overflow: 'hidden',
    },
    title: {
      marginBottom: theme.spacing(1),
      fontWeight: 'bold',
    },
    nodeActionsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
    },
  }),
);

interface IGraphNodeProps {
  node: GraphPolicyNode;
  wrapperClassName?: string;
  onAddEdge?: (nodeId: number) => void;
  onEditNode?: (nodeId: number) => void;
  onDeleteNode?: (nodeId: number) => void;
}

export default function GraphNode({node, wrapperClassName, onAddEdge, onEditNode, onDeleteNode}: IGraphNodeProps) {
  const classes = useStyles();

  const optionImages = useContext(OptionImagesContext)?.optionImages || [];
  const getImgUrl = (imgName: string) => {
    return _.find(optionImages, { name: imgName })?.url;
  };

  const getAvatar = (edge: IOutEdge) => {
    if (edge.option?.type === 'IMAGE') {
      const optionImg = edge.option as ImageOption;
      return <Avatar className={classes.optionImg} variant="rounded" src={getImgUrl(optionImg.imageName) || ''}/>;
    } else if (edge.type === 'CONFIRM') {
      return <Avatar className={classes.optionImg} variant="rounded"><ContactSupport/></Avatar>;
    } else if (edge.type === 'EMAIL') {
      return <Avatar className={classes.optionImg} variant="rounded"><Email/></Avatar>;
    } else if (edge.type === 'EMPTY') {
      return <Avatar className={classes.optionImg} variant="rounded"><NotInterested/></Avatar>;
    }
    return <Avatar className={classes.optionImg} variant="rounded"><TextFields/></Avatar>;
  };

  const nodeJson = node.toJsonObj();

  return (
      <Card className={`${classes.nodePaper} ${wrapperClassName}`}>
        <CardContent>
          <Typography className={classes.title} variant="subtitle2">
            {node.nodeId}. {node.actionName} &nbsp;
            <Typography component="span" variant="subtitle2" color="secondary" align="right">
              {nodeJson.nodeType}
            </Typography>
          </Typography>
          <Alert icon={false} severity="info" className={classes.alert}>
            <Tooltip disableFocusListener={true} title={nodeJson.utterance}>
              <Typography component="div" className={classes.utteranceText} variant="caption">
                {nodeJson.utterance}
              </Typography>
            </Tooltip>
          </Alert>
          {
            (node.edges?.length >= 1) ?
            <div className={classes.optionContainer}>
              {node.toJsonObj().outEdges.map((e, index) => {
                return <EdgeChip node={node} edgeId={e.nodeId} key={index}/>;
              })}
            </div>
            :
            <></>
          }
        </CardContent>
        <CardActions className={classes.nodeActionsContainer}>
          {
            onAddEdge &&
              <Tooltip title="Add an edge">
                <IconButton color="secondary" size="small" onClick={() => onAddEdge(node.nodeId)}>
                  <Add />
                </IconButton>
              </Tooltip>
          }
          {
            onEditNode &&
            <Tooltip title="Edit this node">
              <IconButton color="default" size="small" onClick={() => onEditNode(node.nodeId)}>
                <Edit />
              </IconButton>
            </Tooltip>
          }
          {
            onDeleteNode &&
            <Tooltip title="Delete this node">
              <IconButton color="default" size="small" onClick={() => onDeleteNode(node.nodeId)}>
                <Delete />
              </IconButton>
            </Tooltip>
          }
        </CardActions>
      </Card>

  );
}
