import { ImageOption } from '@bavard/agent-config';
import {
  GraphPolicyNode,
  IOutEdge,
} from '@bavard/agent-config/dist/graph-policy';
import { Avatar, Paper, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Email, Feedback, NotInterested, TextFields } from '@material-ui/icons';
import _ from 'lodash';
import React, { ReactElement, useContext } from 'react';
import { OptionImagesContext } from '../../../context/OptionImages';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    option: {
      height: 30,
      display: 'flex',
      position: 'relative',
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
    actions: {
      position: 'absolute',
      right: theme.spacing(1),
      zIndex: 1,
    },
  }),
);

interface IEdgeChipProps {
  node: GraphPolicyNode;
  edgeId: number;
  actions?: ReactElement;
}

export default function EdgeChip({ node, edgeId, actions }: IEdgeChipProps) {
  const classes = useStyles();

  const optionImages = useContext(OptionImagesContext)?.optionImages || [];
  const getImgUrl = (imgName: string) => {
    return _.find(optionImages, { name: imgName })?.url;
  };

  const getAvatar = (edge: IOutEdge) => {
    if (edge.option?.type === 'IMAGE') {
      const optionImg = edge.option as ImageOption;
      return (
        <Avatar
          className={classes.optionImg}
          variant="rounded"
          src={getImgUrl(optionImg.imageName) || ''}
        />
      );
    } else if (edge.type === 'CONFIRM') {
      return (
        <Avatar className={classes.optionImg} variant="rounded">
          <Feedback />
        </Avatar>
      );
    } else if (edge.type === 'EMAIL') {
      return (
        <Avatar className={classes.optionImg} variant="rounded">
          <Email />
        </Avatar>
      );
    } else if (edge.type === 'EMPTY') {
      return (
        <Avatar className={classes.optionImg} variant="rounded">
          <NotInterested />
        </Avatar>
      );
    }
    return (
      <Avatar className={classes.optionImg} variant="rounded">
        <TextFields />
      </Avatar>
    );
  };

  const edgeNode = node.getEdgeById(edgeId);
  const edgeJson = edgeNode?.toJsonObj();
  const edgeText =
    edgeNode?.toJsonObj().option?.intent || edgeNode?.dest.actionName;
  if (!edgeNode || !edgeJson) {
    return <></>;
  }

  return (
    <Tooltip
      disableFocusListener={true}
      title={`${edgeJson?.type} edge: ${edgeText}`}>
      <Paper className={classes.option}>
        {getAvatar(edgeJson)}
        <div className={classes.optionText}>{edgeText}</div>

        <div className={classes.actions}>{actions}</div>
      </Paper>
    </Tooltip>
  );
}
