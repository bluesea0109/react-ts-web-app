import { useLazyQuery } from '@apollo/react-hooks';
import {Edge, GraphPolicy, ImageOption , TextOption, UtteranceNode} from '@bavard/graph-policy';
import { Button, FormControl, FormControlLabel, FormLabel, InputLabel,
  MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, {useState, useEffect} from 'react';
import {uploadFileWithFetch} from '../../../utils/xhr';
import ContentLoading from '../../ContentLoading';
import {getSignedImgUploadUrlQuery} from './gql';
import ImageUploadPreviewer from './ImageUploadPreviewer';
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
    return n.nodeId !== nodeId;
  }).sort((a, b) => {
    return a.nodeId - b.nodeId;
  });

  const node = policy.getNodeById(nodeId);
  let edge: Edge | undefined;
  if (edgeId) {
    edge = node?.getEdgeById(edgeId);
  }

  let edgeOption: TextOption| ImageOption | undefined;
  if (edge?.option?.type === 'TEXT') {
    edgeOption = edge.option as TextOption;
  }
  if (edge?.option?.type === 'IMAGE') {
    edgeOption = edge.option as ImageOption;
  }

  const [nodeExists, setNodeExists] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<any>(edge?.dest.nodeId);
  const [optionType, setOptionType] = useState<string>(edge?.option?.type || 'TEXT');
  const [intent, setIntent] = useState(edge?.option?.intent || '');
  const [actionText, setActionText] = useState<string>(edgeOption?.text || '');
  const [utterance, setUtterance] = useState('');
  const [actionName, setActionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState<File|undefined>(undefined);
  const [getSignedImgUploadUrl, signedImgUploadResult] = useLazyQuery<IGetImageUploadSignedUrlQueryResult>(getSignedImgUploadUrlQuery);

  const setEdgeNodeExists = (event: any) => {
    setNodeExists(event.target.value === 'true');
  };

  const prepareSignedUploadUrl = () => {
    if (optionType === 'IMAGE' && actionText.length >= 1 && imgFile) {
      getSignedImgUploadUrl({
        variables: {
          agentId,
          basename: actionText,
        },
      });
    }
  };

  useEffect(prepareSignedUploadUrl, [imgFile]);

  const handleImg = (file: File) => {
    setImgFile(file);
  };

  const handleSubmit = async() => {
    if (!node) {
      return enqueueSnackbar('Parent node did not exist', { variant: 'error' });
    }

    if (edgeId) {
      node.removeEdge(edgeId);
    }

    let edgeNode = policy.getNodeById(selectedNodeId);

    if (!edgeNode && !nodeExists && utterance && actionName) {
      edgeNode = new UtteranceNode(policy.nodeCount() + 1, utterance, actionName);
      setSelectedNodeId(edgeNode.nodeId);
    }

    if (!edgeNode) {
      return enqueueSnackbar('The selected edge is invalid', { variant: 'error' });
    }

    if (optionType === 'TEXT') {
      node.addEdge(edgeNode, new TextOption(intent, actionText));
    } else if (optionType === 'IMAGE') {
      if (!imgFile) {
        return enqueueSnackbar('Please select an image for the option', { variant: 'error' });
      }

      const uploadUrl = signedImgUploadResult.data?.ChatbotService_imageOptionUploadUrl?.url.replace(/"/g, "");

      if (!uploadUrl) {
        prepareSignedUploadUrl();
        return enqueueSnackbar('Image upload not ready. Please try in 10 seconds, or try a new image', { variant: 'error' });
      }

      try {
        setLoading(true);
        await uploadFileWithFetch(imgFile, uploadUrl, "PUT");
      } catch (e) {
        enqueueSnackbar(`Error with uploading the image to GCS - ${JSON.stringify(e)}`, { variant: 'error' });
      }
      setLoading(false);

      node.addEdge(edgeNode, new ImageOption(intent, actionText, ''));
    }

    enqueueSnackbar('Edge added', { variant: 'success' });
    clearForm();
    const newPolicy = new GraphPolicy(policy.rootNode);
    onSuccess(newPolicy);
  };

  const clearForm = () => {
    setSelectedNodeId(null);
    setIntent('');
    setOptionType('TEXT');
    setActionText('');
    setSelectedNodeId(null);
    setUtterance('');
    setActionName('');
  };

  return (
    <Paper className={classes.nodePaper}>
      <Typography variant={'h6'} className={classes.formControl}>
        {
          edge ?
          'Editing Edge'
          :
          'Add a new edge'
        }
      </Typography>

      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel>Option Type {optionType}</FormLabel>
        <RadioGroup name="responseType" defaultValue={optionType || 'TEXT'} onChange={(event) => {setOptionType(event.target.value); }}>
          <FormControlLabel value={'TEXT'} control={<Radio />} label="Text" />
          <FormControlLabel value={'IMAGE'} control={<Radio />} label="Image" />
        </RadioGroup>
        {
          optionType === 'IMAGE' && (
            <ImageUploadPreviewer onChange={handleImg}/>
          )
        }
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <TextField name="intent" label="Intent" variant="outlined"
          defaultValue={intent}
          onChange={(e) => setIntent(e.target.value as string)} />
      </FormControl>
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField name="text" label="Text/ImageName" variant="outlined"
          defaultValue={actionText}
          onBlur={(e) => {setActionText(e.target.value as string); prepareSignedUploadUrl(); }} />
      </FormControl>

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
            <TextField name="actionName" label="Action Name" variant="outlined" onChange={(e) => setActionName(e.target.value as string)} />
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <TextField name="utterance" label="Utterance" variant="outlined" onChange={(e) => setUtterance(e.target.value as string)} />
          </FormControl>
        </div>
        :
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Node</InputLabel>
              <Select
                value={selectedNodeId || 0}
                onChange={(event) => setSelectedNodeId(event.target.value as number)}
                label="Node"
              >
                <MenuItem key={nodeList.length} value={0} disabled={true}></MenuItem>
                {
                  nodeList.map((n, index) => {
                  return <MenuItem key={index}value={n.nodeId}>{n.nodeId}: {n.actionName}</MenuItem>;
                  })
                }
              </Select>
          </FormControl>
      }


      <Button variant="contained" disabled={loading || signedImgUploadResult.loading}
        color="primary" type="submit" onClick={handleSubmit}>
          {
            edge ?
            'Update Edge'
            :
            'Add edge'
          }
        </Button>
      {(loading || signedImgUploadResult.loading) && <ContentLoading/>}
    </Paper>
  );
}
