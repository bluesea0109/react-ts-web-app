import { useLazyQuery } from '@apollo/client';
import { BaseEdge, ConfirmEdge , EmailNode, EmptyEdge, GraphPolicy, ImageOption, TextOption, UtteranceEdge, UtteranceNode} from '@bavard/graph-policy';
import { Button, FormControl, FormControlLabel, FormLabel, InputLabel,
  MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, {useContext, useEffect, useState} from 'react';
import {OptionImagesContext} from '../../../context/OptionImages';
import { IOptionImage } from '../../../models/chatbot-service';
import {validateEmail} from '../../../utils/string';
import ContentLoading from '../../ContentLoading';
import ImageSelectorGrid from '../../Utils/ImageSelectorGrid';
import { getSignedImgUploadUrlQuery} from './gql';
import {IGetImageUploadSignedUrlQueryResult} from './types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullWidth: {
      width: '100%',
    },
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    nodePaper: {
      borderRadius: theme.spacing(1),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
    optionImage: {
      width: 100,
      height: 100,
      borderRadius: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

interface IUpsertEdgeFormProps {
  agentId: number;
  nodeId: number;
  onCancel: () => void;
  onSuccess: (policy: GraphPolicy) => void;
  policy: GraphPolicy;
  edgeId?: number;
}

export default function UpsertEdgeForm({agentId, nodeId, policy, edgeId , onCancel, onSuccess}: IUpsertEdgeFormProps) {
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();
  const nodeList = policy.toJsonObj().nodes.filter((n) => {
    return (n.nodeId !== nodeId && n.nodeType === EmailNode.typename);
  }).sort((a, b) => {
    return a.nodeId - b.nodeId;
  });

  const node = policy.getNodeById(nodeId);
  let edge: ConfirmEdge | undefined;
  if (edgeId) {
    edge = node?.getEdgeById(edgeId) as ConfirmEdge;
  }

  const [nodeExists, setNodeExists] = useState(true);
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<any>(edge?.dest.nodeId);
  const [senderEmail, setSenderEmail] = useState('');
  const [utterance, setUtterance] = useState('');
  const [actionName, setActionName] = useState('');
  const [loading, setLoading] = useState(false);

  const setEdgeNodeExists = (event: any) => {
    setNodeExists(event.target.value === 'true');
  };

  const handleSubmit = async() => {
    setShowFormErrors(true);
    console.log({ actionName, utterance});

    // Parent node must exist
    if (!node) {
      return enqueueSnackbar('Parent node does not exist', { variant: 'error' });
    }

    // // If the same node is already an edge, remove it, then modify and re-add
    if (edgeId) {
      node.removeEdge(edgeId);
    }

    // // Preliminary validation
    if (!actionName || actionName.length < 1 || !validateEmail(senderEmail)) {
      return;
    }

    // // Check if the edge node already exists
    let edgeNode = policy.getNodeById(selectedNodeId);
    console.log('NODE EXISTS: ?', edgeNode);

    // // If not instantiate a new one
    if (!edgeNode && !nodeExists && utterance && actionName && senderEmail) {
      let nodeNumber = 1;
      policy.toJsonObj().nodes.forEach((n) => {
        if (n.nodeId > nodeNumber) {
          nodeNumber = n.nodeId;
        }
      });
      nodeNumber += 1;
      console.log('CREATING EMAIL NODE ', {nodeNumber, actionName, utterance});
      edgeNode = new EmailNode(nodeNumber, actionName, senderEmail, utterance);
      console.log('EDGE NODE created: ', edgeNode);
      setSelectedNodeId(edgeNode.nodeId);
    }

    console.log('EDGE NODE ', edgeNode);

    // // If something went wrong with selecting / creating the edge node
    if (!edgeNode) {
      return enqueueSnackbar('The selected edge is invalid', { variant: 'error' });
    }

    node.addConfirmEdge(edgeNode);

    enqueueSnackbar('Edge added', { variant: 'success' });
    const newPolicy = new GraphPolicy(policy.rootNode);
    clearForm();
    onSuccess(newPolicy);
  };

  const clearForm = () => {
    setSelectedNodeId(null);
    setUtterance('');
    setActionName('');
  };

  return (
    <div>
      {
        !edge &&
        <FormControl component="fieldset" className={classes.formControl}>
          <RadioGroup name="existingNode" defaultValue={nodeExists.toString()} onChange={setEdgeNodeExists}>
            <FormControlLabel value={'true'} control={<Radio />} label="Existing Node" />
            <FormControlLabel value={'false'} control={<Radio />} label="Create a Node" />
          </RadioGroup>
        </FormControl>
      }

      {
        !nodeExists && !edge ?
        <div>
          <FormControl variant="outlined" className={classes.formControl}>
            <TextField name="actionName" error={showFormErrors && actionName === ''}
              required={true} label="Action Name" variant="outlined"
              onChange={(e) => setActionName(e.target.value as string)} />
          </FormControl>
          <FormControl variant="outlined"  className={classes.formControl} >
            <TextField name="senderEmail" error={showFormErrors && !validateEmail(senderEmail)}
              required={true} label="Sender Email" variant="outlined"
              type={'email'}
              onChange={(e) => setSenderEmail(e.target.value as string)} />
          </FormControl>
          <FormControl variant="outlined"  className={classes.formControl} >
            <TextField name="utterance" error={showFormErrors && utterance === ''}
              required={true} label="Utterance" variant="outlined"
              onChange={(e) => setUtterance(e.target.value as string)} />
          </FormControl>
        </div>
        :
          <FormControl variant="outlined" className={classes.formControl} required={true}
            error={showFormErrors && !selectedNodeId}>
            <InputLabel>Node</InputLabel>
              <Select
                value={selectedNodeId || 0}
                onChange={(event) => setSelectedNodeId(event.target.value as number)}
                label="Node"
              >
                <MenuItem key={nodeList.length} value={0} disabled={true}/>
                {
                  nodeList.map((n, index) => {
                  return <MenuItem key={index}value={n.nodeId}>{n.nodeId}: {n.actionName}</MenuItem>;
                  })
                }
              </Select>
          </FormControl>
      }

      <Button variant="contained" disabled={loading}
        color="primary" type="submit" onClick={handleSubmit}>
          {
            edge ?
            'Update Edge'
            :
            'Add edge'
          }
        </Button>
      {(loading) && <ContentLoading/>}
    </div>
  );
}
