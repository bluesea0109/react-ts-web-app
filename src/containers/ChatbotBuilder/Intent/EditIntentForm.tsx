import { IIntent, BaseAgentAction } from '@bavard/agent-config';
import { DropDown } from '../../../components';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TextInput } from '../../../components';
import { Maybe } from '../../../utils/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formField: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    input: {
      '& .MuiOutlinedInput-input': {
        padding: '12px 12px',
      },
    },
  }),
);

interface EditIntentFormProps {
  actions: BaseAgentAction[];
  currentIntent: Maybe<IIntent>;
  onUpdateIntent: (intent: IIntent) => void;
}

const EditIntentForm: React.FC<EditIntentFormProps> = ({
  actions,
  currentIntent,
  onUpdateIntent,
}) => {
  const classes = useStyles();

  return (
    <>
      <Grid
        container={true}
        item={true}
        sm={12}
        justify="flex-start"
        className={classes.formField}>
        <Typography variant="h6">
          {
            'Add an intent to customize your Assistant’s behavior. Each intent must have a unique name'
          }
        </Typography>
      </Grid>
      <Grid container={true} item={true} sm={12} className={classes.formField}>
        <TextInput
          fullWidth={true}
          label="Intent*"
          value={currentIntent?.name || ''}
          className={classes.input}
          onChange={(e) =>
            onUpdateIntent({
              ...currentIntent,
              name: e.target.value.replace(/ /g, '+'),
            } as any)
          }
        />
      </Grid>
      <Grid container={true} item={true} sm={12} className={classes.formField}>
        <DropDown
          label="Default Action"
          labelPosition="left"
          fullWidth={true}
          current={actions.find(
            (action) => action.name === currentIntent?.defaultActionName,
          )}
          menuItems={actions}
          onChange={(action: any) => {
            onUpdateIntent({
              ...currentIntent,
              defaultActionName: action,
            } as any);
          }}
        />
      </Grid>
    </>
  );
};

export default EditIntentForm;
