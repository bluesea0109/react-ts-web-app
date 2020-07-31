import { Paper, FormControl, Button, Radio, 
  RadioGroup,FormLabel, InputLabel, TextField, MenuItem, Select, FormControlLabel} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import React, {useState} from 'react';
import {GraphPolicy, TextOption, ImageOption, UtteranceNode} from '@bavard/graph-policy';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fullWidth: {
      width: '100%'
    },
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(1)
    },
    nodePaper: {
      borderRadius: theme.spacing(1),
      margin: theme.spacing(1),
      padding: theme.spacing(2)
    },
  }),
);

interface IGraphNodeProps {
  nodeId: number;
  onCancel: ()=>void;
  onSuccess: (policy: GraphPolicy)=>void;
  policy: GraphPolicy;
}

export default function AddEdgeForm({nodeId, policy, onCancel, onSuccess}: IGraphNodeProps) {
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();
  const nodeList = policy.toJsonObj().nodes;
  const node = policy.getNodeById(nodeId);
  const [nodeExists, setNodeExists] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<any>(null);
  const [optionType, setOptionType] = useState("TEXT");
  const [intent, setIntent] = useState("");
  const [actionText, setActionText] = useState("");
  const [utterance, setUtterance] = useState("");
  const [actionName, setActionName] = useState("");

  const setEdgeNodeExists = (event:any) => {
    console.log(event?.target?.value);
    setNodeExists(event.target.value === "true");
  }

  const handleSubmit = () => {
    if(!node) {
      return enqueueSnackbar("Parent node did not exist", { variant: "error" });
    }
    console.log({
      intent,
      optionType,
      actionText,
      selectedNodeId
    });

    let edgeNode = policy.getNodeById(selectedNodeId);

    if(!edgeNode && !nodeExists && utterance && actionName) {
      edgeNode = new UtteranceNode(policy.nodeCount()+1, utterance, actionName);
      setSelectedNodeId(edgeNode.nodeId);
    }

    if(!edgeNode) {
      return enqueueSnackbar("The selected edge is invalid", { variant: "error" });
    }

    console.log("EDGE NODE ", edgeNode);

    if(optionType === "TEXT") {
      node.addEdge(edgeNode, new TextOption(intent, actionText));
    }
    else if(optionType === "IMAGE") {
      node.addEdge(edgeNode, new ImageOption(intent, actionText));
    }

    enqueueSnackbar("Edge added", { variant: "success" });
    clearForm();
    let newPolicy = new GraphPolicy(policy.rootNode);
    console.log("NEW POLICY: ", newPolicy);
    onSuccess(newPolicy);
  }

  const clearForm = () => {
    setSelectedNodeId(null);
    setIntent("");
    setOptionType("TEXT");
    setActionText("");
    setSelectedNodeId(null);
    setUtterance("");
    setActionName("");
  }


  return (
    <Paper className={classes.nodePaper}>
      <FormControl component="fieldset" className={classes.formControl}>
        <RadioGroup name="existingNode" value={nodeExists.toString()} onChange={setEdgeNodeExists}>
          <FormControlLabel value={"true"} control={<Radio />} label="Existing Node" />
          <FormControlLabel value={"false"} control={<Radio />} label="Create a Node" />
        </RadioGroup>
      </FormControl>

      {
        !nodeExists ?
        <div>
          <FormControl variant="outlined" className={classes.formControl}>
            <TextField name="actionName" label="Action Name" variant="outlined" onChange={(e)=>setActionName(e.target.value as string)} />
          </FormControl> 
          <FormControl variant="outlined" className={classes.formControl}>
            <TextField name="utterance" label="Utterance" variant="outlined" onChange={(e)=>setUtterance(e.target.value as string)} />
          </FormControl> 
        </div>
        :
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Node</InputLabel>
              <Select
                value={selectedNodeId}
                onChange={(event)=>setSelectedNodeId(event.target.value as number)}
                label="Node"
              >
                {
                  nodeList.map((n, index)=>{
                    return <MenuItem key={index}value={n.nodeId}>{n.actionName}</MenuItem>
                  })
                }
              </Select>
          </FormControl>
      }

          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel>Option Type</FormLabel>
            <RadioGroup name="responseType" value={optionType} onChange={(event)=>{setOptionType(event.target.value)}}>
              <FormControlLabel value={"TEXT"} control={<Radio />} label="Text" />
              <FormControlLabel value={"IMAGE"} control={<Radio />} label="Image" />
            </RadioGroup>
          </FormControl>

          <FormControl variant="outlined" className={classes.formControl}>
            <TextField name="intent" label="Intent" variant="outlined" onChange={(e)=>setIntent(e.target.value as string)} />
          </FormControl> 
          <FormControl variant="outlined" className={classes.formControl}>
            <TextField name="text" label="Text/ImageName" variant="outlined" onChange={(e)=>setActionText(e.target.value as string)} />
          </FormControl> 
          
          <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>Add Edge</Button>
    </Paper>
  );
}
