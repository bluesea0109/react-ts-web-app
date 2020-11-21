import React from 'react';
import { Grid, makeStyles, Box } from '@material-ui/core';
import { ACTION_TYPE, FIELD_TYPE } from './type';
import { DropDown, TextInput } from '../../../components';
import { IUserUtteranceAction } from '@bavard/agent-config/dist/actions/user';
import { IAgentUtteranceAction } from '@bavard/agent-config';
import { IIntent } from '../../../models/chatbot-service';
import { useRecoilState } from 'recoil';
import { trainingConversation } from '../atoms';
interface GroupFieldProps {
  type: ACTION_TYPE;
  data: string | undefined;
  option: string[];
  field: FIELD_TYPE;
  order: number;
}

const useStyles = makeStyles((theme) => ({
  input: {
		'& .MuiOutlinedInput-input': {
			padding: '8px 8px',
		},
	},
  root: {
    flexGrow: 1,
  },
  field: {
    padding: theme.spacing(2),
  },
}));
export const GroupField = ({ type, data, option, field, order }: GroupFieldProps) => {
  
  const classes = useStyles();
  const [re_data, updateData] = useRecoilState(trainingConversation);

  console.log('Training Conversaiton in Update Field >>> ', re_data);
  console.log('>>> metadata >>> ', type, data, option, field, order)
  const handleDropdownChange = () => {

  }

  const handleTextChange = () => {

  }
  return (
    <Box display="flex" flexDirection="row" style={{width: '100%'}} paddingX={1}>
      <Grid item sm={4} xs={4} className={classes.field}>
        <DropDown
          fullWidth={true}
          labelPosition="left"
          label="Intent"
          menuItems={option}
          current={data}
          onChange={handleDropdownChange}
        />
      </Grid>
      <Grid item sm={8} xs={8} className={classes.field}>
        <TextInput
          fullWidth={true}
					label="Action Name"
          value={data}
          className={classes.input}
          onChange={handleTextChange}
        />
      </Grid>
    </Box>
  );
};
