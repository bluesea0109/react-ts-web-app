import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOffSharp';
import VisibilityIcon from '@material-ui/icons/VisibilitySharp';
import { cloneDeep } from 'lodash';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as actions from '../../../store/image-labeling/actions';
import ImageCategoricalLabel from '../models/labels/ImageLabel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(8),
    },
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    selected: {
      // background: `${theme.palette.secondary.main} !important`,
      border: `1px solid ${theme.palette.secondary.main}`,
    },
    listItemModified: {
      borderLeft: `2px solid red !important`,
      // background: `#d50000 !important`
    },
    margin: {
      margin: theme.spacing(1),
    },
    marginRight: {
      marginRight: theme.spacing(1),
    },
    checkbox: {
      padding: 0,
    },
    iconButton: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    grow: {
      flexGrow: 1,
    },
  }),
);

const mapDispatch = {
  addLabel: actions.addLabel,
  removeLabel: actions.removeLabel,
  updateLabel: actions.updateLabel,
  selectLabel: actions.selectLabel,
};

const connector = connect(null, mapDispatch);

interface IImageLabelListItemProps extends ConnectedProps<typeof connector> {
  label: ImageCategoricalLabel;
  labelIndex: number;
  selected: boolean;
  editable: boolean;
}

function ImageLabelListItem(props: IImageLabelListItemProps) {
  const classes = useStyles();
  const { label, labelIndex, selected } = props;

  const toggleLabelVisible = (label: ImageCategoricalLabel) => (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const updatedLabel = cloneDeep(label);
    updatedLabel.visible = !updatedLabel.visible;
    props.updateLabel(updatedLabel, labelIndex);
    e.preventDefault();
    e.stopPropagation();
  };

  const toggleLabelExpand = (label: ImageCategoricalLabel) => (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const updatedLabel = cloneDeep(label);
    updatedLabel.open = !updatedLabel.open;
    props.updateLabel(updatedLabel, labelIndex);
    e.preventDefault();
    e.stopPropagation();
  };

  const deleteLabelShape = (label: ImageCategoricalLabel, shapeIndex: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const updatedLabel = cloneDeep(label);
    updatedLabel.deleteShape(shapeIndex);
    props.updateLabel(updatedLabel, labelIndex);
    e.preventDefault();
    e.stopPropagation();
  };

  const listItemClasses = {
    selected: classes.selected,
    root: label.modified ? classes.listItemModified : undefined,
  };

  const onSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    props.selectLabel(labelIndex);
  };

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    props.removeLabel(labelIndex);
  };

  return (
    <React.Fragment>
      <ListItem
        disableRipple={true}
        classes={listItemClasses}
        button={true}
        dense={true}
        selected={selected}
        onClick={onSelect}>

        {label.visible ? (
          <VisibilityIcon color="secondary" onClick={toggleLabelVisible(label)} fontSize="small" />
        ) : (
            <VisibilityOffIcon color="secondary" onClick={toggleLabelVisible(label)} fontSize="small" />
          )}
        <ListItemText color="inherit" primaryTypographyProps={{ variant: 'body2' }}
          primary={label.category ? `${label.categorySetName}:${label.category}` : ''}
          secondary={label.displayType} />
        {props.editable ? (
          <IconButton size="small" color="default" style={{ padding: 6 }} onClick={onDelete}>
            <DeleteIcon color="secondary" fontSize="small" />
          </IconButton>
        ) : null}
        <ListItemSecondaryAction>
          {label.open ? (
            <ExpandLess color="secondary" onClick={toggleLabelExpand(label)} />
          ) : (
              <ExpandMore color="secondary" onClick={toggleLabelExpand(label)} />
            )
          }
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={label.open} timeout="auto" unmountOnExit={true}>
        <List component="div" disablePadding={true} dense={true}>
          {label.getShapes().map((shape, i) => (
            <ListItem key={i} className={classes.nested}>
              {label.visible ? (
                <VisibilityIcon color="secondary" fontSize="small" />
              ) : (
                  <VisibilityOffIcon color="secondary" fontSize="small" />
                )}
              <ListItemText inset={true} primary={shape.displayString} primaryTypographyProps={{ variant: 'body2' }} />
              {props.editable ? (
                <IconButton size="small" color="default" onClick={deleteLabelShape(label, i)} style={{ padding: 6 }} >
                  <DeleteIcon color="secondary" fontSize="small" />
                </IconButton>
              ) : null}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </React.Fragment >
  );
}

export default connector(ImageLabelListItem);
