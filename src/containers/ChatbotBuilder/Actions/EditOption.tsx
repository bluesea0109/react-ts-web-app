import {
  EResponseOptionTypes,
  IHyperlinkOption,
  IImageOption,
  IIntent,
  IResponseOption,
} from '@bavard/agent-config';
import {
  DropDown,
  IconButton,
  RichTextInput,
  TextInput,
} from '@bavard/react-components';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import React, { useMemo } from 'react';
import OptionImageUploader from './OptionImageUploader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(3),
      paddingRight: theme.spacing(4),
      paddingBottom: theme.spacing(3),
      paddingLeft: theme.spacing(4),
    },
    formField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    input: {
      '& .MuiOutlinedInput-input': {
        padding: '12px 12px',
      },
    },
  }),
);

interface EditOptionProps {
  intents: IIntent[];
  option: IResponseOption;
  onUpdateOption: (option: IResponseOption) => void;
  onDeleteOption: () => void;
}

const EditOption = ({
  intents,
  option,
  onUpdateOption,
  onDeleteOption,
}: EditOptionProps) => {
  const classes = useStyles();

  const OptionTypes = [
    EResponseOptionTypes.TEXT,
    EResponseOptionTypes.HYPERLINK,
    EResponseOptionTypes.IMAGE,
  ].map((type) => ({
    id: type,
    value: type,
  }));

  const isIntentRequired = option.type !== EResponseOptionTypes.HYPERLINK;
  const isHyperLinkOption = option.type === EResponseOptionTypes.HYPERLINK;
  const isImageOption = option.type === EResponseOptionTypes.IMAGE;

  const allIntents = useMemo(() => {
    return intents.map((intent) => ({
      id: intent.name,
      value: intent.name,
    }));
  }, [intents]);

  return (
    <Grid container={true} className={classes.root}>
      <Grid container={true} className={classes.formField}>
        <DropDown
          fullWidth={true}
          label="Option Type"
          labelType="Typography"
          labelPosition="top"
          menuItems={OptionTypes}
          current={option.type}
          padding="12px"
          onChange={(type) =>
            onUpdateOption({
              ...option,
              type,
            } as IResponseOption)
          }
        />
      </Grid>
      <Grid container={true} className={classes.formField}>
        <RichTextInput
          label="Option Text"
          value={option.text || ''}
          onChange={(html: string) => onUpdateOption({ ...option, text: html })}
        />
      </Grid>
      {isHyperLinkOption && (
        <Grid container={true} className={classes.formField}>
          <TextInput
            fullWidth={true}
            label="Hyperlink Target"
            value={(option as IHyperlinkOption).targetLink || ''}
            className={classes.input}
            onChange={(e) =>
              onUpdateOption({
                ...option,
                targetLink: e.target.value,
              } as IHyperlinkOption)
            }
          />
        </Grid>
      )}
      {isIntentRequired && (
        <Grid container={true} className={classes.formField}>
          <DropDown
            fullWidth={true}
            label="Option Intent"
            labelType="Typography"
            labelPosition="top"
            menuItems={allIntents}
            current={option.intent || ''}
            padding="12px"
            onChange={(intent) =>
              onUpdateOption({
                ...option,
                intent,
              } as IResponseOption)
            }
          />
        </Grid>
      )}
      {isImageOption && (
        <>
          <Grid container={true} className={classes.formField}>
            <TextInput
              fullWidth={true}
              label="Image Name"
              value={(option as IImageOption).imageName || ''}
              className={classes.input}
              onChange={(e) =>
                onUpdateOption({
                  ...option,
                  imageName: e.target.value,
                } as IResponseOption)
              }
            />
          </Grid>
          <Grid container={true} className={classes.formField}>
            <TextInput
              fullWidth={true}
              label="Image Caption"
              value={(option as IImageOption).caption || ''}
              className={classes.input}
              onChange={(e) =>
                onUpdateOption({
                  ...option,
                  caption: e.target.value,
                } as IResponseOption)
              }
            />
          </Grid>
          <Grid container={true} className={classes.formField}>
            <OptionImageUploader
              option={option as IImageOption}
              onUpdateOption={onUpdateOption}
            />
          </Grid>
        </>
      )}
      <Grid container={true} justify="flex-end">
        <IconButton
          title="Delete"
          iconPosition="left"
          variant="text"
          Icon={Delete}
          onClick={onDeleteOption}
        />
      </Grid>
    </Grid>
  );
};

export default EditOption;
