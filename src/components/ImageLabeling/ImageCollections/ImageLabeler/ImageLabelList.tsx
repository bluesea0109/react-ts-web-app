import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    }
  })
);

interface IImageLabelListProps {
  labels: ImageCategoricalLabel[]
}

function ImageLabelList(props: IImageLabelListProps) {
  const classes = useStyles();
  const [state, setState] = useState({
    checked: [0],
  });

  const handleToggle = (labelIdx: number) => () => {
    const { checked } = state;
    const currentIndex = checked.indexOf(labelIdx);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(labelIdx);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setState({
      ...state,
      checked: newChecked,
    });
  };

  return (
    <List className={classes.root}>
      {props.labels.map((label, i) => (
        <ListItem key={i} role={undefined} dense button onClick={handleToggle(i)}>
          <Checkbox
            checked={state.checked.indexOf(i) !== -1}
            tabIndex={-1}
            disableRipple
          />
          <ListItemText primary={label.category} />
          <ListItemSecondaryAction>
            <IconButton>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

export default ImageLabelList;