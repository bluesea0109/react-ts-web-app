import { useLazyQuery, useQuery } from '@apollo/client';
import {Edge, GraphPolicy, ImageOption , TextOption, UtteranceNode} from '@bavard/graph-policy';
import { Button, FormControl, FormControlLabel, FormLabel, InputLabel,
  MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, {useEffect, useState} from 'react';
import {uploadFileWithFetch} from '../../../utils/xhr';
import ContentLoading from '../../ContentLoading';
import {getSignedImgUploadUrlQuery, getOptionImagesQuery} from './gql';
import ImageSelectorGrid from '../../Utils/ImageSelectorGrid';
import {IGetImageUploadSignedUrlQueryResult, IGetOptionImagesQueryResult} from './types';
import { IOptionImage } from '../../../models/chatbot-service';

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
      backgroundColor: theme.palette.background.paper
    }
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
  const [existingImg, setExistingImg] = useState<string | undefined>(edgeOption?.type === 'IMAGE' ? edgeOption?.text : undefined);
  const [getSignedImgUploadUrl, signedImgUploadResult] = useLazyQuery<IGetImageUploadSignedUrlQueryResult>(getSignedImgUploadUrlQuery);

  // const optionImages = useQuery<IGetOptionImagesQueryResult>(getOptionImagesQuery, {
  //   fetchPolicy: 'cache-and-network',
  //   variables: { agentId },
  // });

  const optionImages = {
    loading: false,
    data: {
      ChatbotService_optionImages: [
        {
          name: "testImage",
          url: "data:image/png;base64,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"
        },
        {
          name: "testImage2",
          url: "data:image/jpeg;base64,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"
        },
        {
          name: "testImage3",
          url: "data:image/png;base64,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"
        },
        {
          name: "testImage4",
          url: "data:image/png;base64,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"
        },
        {
          name: "testImage5",
          url: "data:image/png;base64,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"
        },
        {
          name: "testImage6",
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTlVBfO438OsS8tomKxF-Y4n73ZnGk95DG3gA&usqp=CAU"
        },
        {
          name: "testImage7",
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRCNSoeFbtP3KdBkjqfvyyF_iYg7s3DN5kbSg&usqp=CAU"
        },
        {
          name: "testImage8",
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_7Shs3QYfhU8jZRF5zpBL4ldBO-FdbXvhuQ&usqp=CAU"
        },
        {
          name: "testImage9",
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTrOS5oG9mEKFk52Jconsr5s3nfUAnomWEGBw&usqp=CAU"
        },
        {
          name: "testImage10",
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTqyBHdGaMB3QIfzm7wZO6IQ-c-KT8_KEfhaQ&usqp=CAU"
        },
      ]
    }
  } 

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

  const handleNewImg = (file: File) => {
    setImgFile(file);
    setExistingImg(undefined);
  };

  const handleSelectImg = (img: IOptionImage) => { 
    setActionText(img.name);
    setExistingImg(img.name);
  }

  const handleSubmit = async() => {
    // Parent node must exist
    if (!node) {
      return enqueueSnackbar('Parent node did not exist', { variant: 'error' });
    }

    // If the same node is already an edge, remove it, then modify and re-add
    if (edgeId) {
      node.removeEdge(edgeId);
    }

    if(!intent || !actionText) {
      return enqueueSnackbar('Intent and Action Text/Image Name Are Required Fields', { variant: 'error' });
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
      if (!imgFile && !existingImg) {
        return enqueueSnackbar('Please select an image for the option', { variant: 'error' });
      }

      if(!existingImg && imgFile) {
        const uploadUrl = signedImgUploadResult.data?.ChatbotService_imageOptionUploadUrl?.url.replace(/"/g, '');
        if (!uploadUrl) {
          prepareSignedUploadUrl();
          return enqueueSnackbar('Image upload not ready. Please try in 10 seconds, or try a new image', { variant: 'error' });
        }

        try {
          setLoading(true);
          await uploadFileWithFetch(imgFile, uploadUrl, 'PUT');
        } catch (e) {
          enqueueSnackbar(`Error with uploading the image to GCS - ${JSON.stringify(e)}`, { variant: 'error' });
        }
        setLoading(false);
      }

      node.addEdge(edgeNode, new ImageOption(intent, actionText, actionText));
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
          (optionType === 'IMAGE') && (
            (!optionImages.loading) ?
              <React.Fragment>
                <ImageSelectorGrid onNewImg={handleNewImg} selectedImgName={actionText} images={optionImages?.data?.ChatbotService_optionImages || []} onSelect={handleSelectImg}/>
              </React.Fragment>
            :
            <ContentLoading/>
          )
        }
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <TextField name="intent" label="Intent" variant="outlined"
          defaultValue={intent}
          onChange={(e) => setIntent(e.target.value as string)} />
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        {
          optionType === "TEXT" ?
          <TextField name="text" label={'Text'}
            variant="outlined"
            defaultValue={actionText}
            onBlur={(e) => {setActionText(e.target.value as string); prepareSignedUploadUrl(); }} />
          : (
              (existingImg) ?
              <TextField name="text"
                variant="outlined"
                disabled={true}
                value={actionText} />
              :
              <TextField name="text" label={'New Image Name'}
                variant="outlined"
                defaultValue={actionText}
                onChange={(e) => { setActionText(e.target.value as string);  }}
                onBlur={(e) => prepareSignedUploadUrl()} />
          )
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
