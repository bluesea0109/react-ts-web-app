import { useLazyQuery } from '@apollo/client';
import { BaseEdge, EmptyEdge , GraphPolicy, ImageOption, SentEmailEdge, TextOption, UtteranceEdge, UtteranceNode} from '@bavard/graph-policy';
import { Button, FormControl, FormControlLabel, FormLabel, InputLabel,
  MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, {useContext, useEffect, useState} from 'react';
import {OptionImagesContext} from '../../../context/OptionImages';
import { IOptionImage } from '../../../models/chatbot-service';
import {uploadFileWithFetch} from '../../../utils/xhr';
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
    return n.nodeId !== nodeId;
  }).sort((a, b) => {
    return a.nodeId - b.nodeId;
  });

  const node = policy.getNodeById(nodeId);
  let edge: BaseEdge | undefined;
  if (edgeId) {
    edge = node?.getEdgeById(edgeId);
  }

  let textOption: TextOption | undefined;
  let imgOption: ImageOption | undefined;

  if (edge instanceof UtteranceEdge) {
    if (edge?.option?.type === 'TEXT') {
      textOption = edge.option as TextOption;
    } else if (edge?.option?.type === 'IMAGE') {
      imgOption = edge.option as ImageOption;
    }
  }

  const [nodeExists, setNodeExists] = useState(true);
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<any>(edge?.dest.nodeId);
  const [optionType, setOptionType] = useState<string>(edge instanceof UtteranceEdge ? edge?.option?.type || 'TEXT' : '');
  const [intent, setIntent] = useState(edge instanceof UtteranceEdge ? edge?.option?.intent || '' : '');
  const [actionText, setActionText] = useState<string>(textOption?.text || imgOption?.text || '');
  const [utterance, setUtterance] = useState('');
  const [actionName, setActionName] = useState('');
  const [imageName, setImageName] = useState(imgOption?.imageName || '');
  const [loading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState<File|undefined>(undefined);
  const [existingImg, setExistingImg] = useState<string | undefined>(imgOption?.imageName || undefined);
  const [getSignedImgUploadUrl, signedImgUploadResult] = useLazyQuery<IGetImageUploadSignedUrlQueryResult>(getSignedImgUploadUrlQuery);

  const optionImages = useContext(OptionImagesContext)?.optionImages || [];

  const setEdgeNodeExists = (event: any) => {
    setNodeExists(event.target.value === 'true');
  };

  const prepareSignedUploadUrl = () => {
    if (optionType === 'IMAGE' && imageName.length >= 1 && imgFile) {
      getSignedImgUploadUrl({
        variables: {
          agentId,
          basename: imageName,
        },
      });
    }
  };

  useEffect(prepareSignedUploadUrl, [imgFile]);

  const handleNewImg = (file: File) => {
    setImgFile(file);
    setExistingImg(undefined);
  };

  const handleSelectImg = (img: IOptionImage) => {
    setImageName(img.name);
    setExistingImg(img.name);
  };

  const handleSubmit = async() => {
    setShowFormErrors(true);
    console.log({intent, actionText, imageName, utterance, actionName, existingImg});

    // Parent node must exist
    if (!node) {
      return enqueueSnackbar('Parent node does not exist', { variant: 'error' });
    }

    // If the same node is already an edge, remove it, then modify and re-add
    if (edgeId) {
      node.removeEdge(edgeId);
    }

    // Preliminary validation
    if (!intent || !actionText) {
      return;
    }

    // Check if the edge node already exists
    let edgeNode = policy.getNodeById(selectedNodeId);

    // If not instantiate a new one
    if (!edgeNode && !nodeExists && utterance && actionName) {
      let nodeNumber = 1;
      policy.toJsonObj().nodes.forEach((n) => {
        if (n.nodeId > nodeNumber) {
          nodeNumber = n.nodeId;
        }
      });
      nodeNumber += 1;
      edgeNode = new UtteranceNode(nodeNumber, actionName, utterance);
      setSelectedNodeId(edgeNode.nodeId);
    }

    // If something went wrong with selecting / creating the edge node
    if (!edgeNode) {
      return enqueueSnackbar('The selected edge is invalid', { variant: 'error' });
    }

    // Handle option types
    if (optionType === 'TEXT') {
      node.addUtteranceEdge(edgeNode, new TextOption(intent, actionText));
    } else if (optionType === 'IMAGE') {
      // An old image or a new image file should exist
      if (!imgFile && !existingImg) {
        return enqueueSnackbar('Please select an image for the option', { variant: 'error' });
      }

      // New image file has been selected
      if (!existingImg && imgFile) {
        // Get a signed upload url
        const uploadUrl = signedImgUploadResult.data?.ChatbotService_imageOptionUploadUrl?.url.replace(/"/g, '');
        console.log({uploadUrl});
        // The upload url isn't ready. Wait for a few
        if (!uploadUrl || uploadUrl.indexOf(encodeURIComponent(imageName)) === -1) {
          enqueueSnackbar('Image upload not ready. Please try in 10 seconds, or try a new image', { variant: 'error' });
          prepareSignedUploadUrl();
          return;
        }

        // Signed upload url is ready. Upload the file
        try {
          setLoading(true);
          await uploadFileWithFetch(imgFile, uploadUrl, 'PUT');
        } catch (e) {
          enqueueSnackbar(`Error with uploading the image to GCS - ${JSON.stringify(e)}`, { variant: 'error' });
        }
        setLoading(false);
      }

      // Add the new Image option
      node.addUtteranceEdge(edgeNode, new ImageOption(intent, actionText, imageName));
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
    setImageName('');
    setExistingImg('');
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

      <FormControl component="fieldset" className={classes.formControl} required={true} error={showFormErrors && !optionType}>
        <FormLabel>Option Type {optionType}</FormLabel>
        <RadioGroup name="responseType" defaultValue={optionType || 'TEXT'} onChange={(event) => {setOptionType(event.target.value); }}>
          <FormControlLabel value={'TEXT'} control={<Radio />} label="Text" />
          <FormControlLabel value={'IMAGE'} control={<Radio />} label="Image" />
        </RadioGroup>
        {
          (optionType === 'IMAGE') && (
            <React.Fragment>
              <ImageSelectorGrid onNewImg={handleNewImg} selectedImgName={imageName}
                images={optionImages} onSelect={handleSelectImg}/>
            </React.Fragment>
          )
        }
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <TextField name="intent" label="Intent" variant="outlined"
          required={true}
          error={showFormErrors && intent === ''}
          defaultValue={intent}
          onChange={(e) => setIntent(e.target.value as string)} />
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <TextField name="text" label={'Text'}
          variant="outlined"
          required={true}
          error={showFormErrors && actionText === ''}
          onChange={(e) => setActionText(e.target.value as string)}
          defaultValue={actionText}
          />
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        {
          optionType === 'IMAGE' ?
          (
            (existingImg) ?
            <TextField name="imgNameExisting"
              variant="outlined"
              disabled={true}
              required={true}
              value={existingImg} />
            :
            <TextField name="imgNameNew" label={'New Image Name'}
              variant="outlined"
              defaultValue={imageName}
              required={true}
              error={showFormErrors && imageName === ''}
              onChange={(e) => { setImageName(e.target.value as string);  }}
              onBlur={prepareSignedUploadUrl}
              />
          )
          : <></>
        }
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
            <TextField name="actionName" error={showFormErrors && actionName === ''}
              required={true} label="Action Name" variant="outlined"
              onChange={(e) => setActionName(e.target.value as string)} />
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
