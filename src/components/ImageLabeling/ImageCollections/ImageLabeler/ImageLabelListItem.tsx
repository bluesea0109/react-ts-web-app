import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/VisibilitySharp';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOffSharp';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';

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
      //background: `${theme.palette.secondary.main} !important`,
      border: `1px solid ${theme.palette.secondary.main}`,
    },
    listItemModified: {
      borderLeft: `2px solid red !important`,
      //background: `#d50000 !important`
    },
    margin: {
      margin: theme.spacing(1)
    },
    marginRight: {
      marginRight: theme.spacing(1)
    },
    checkbox: {
      padding: 0
    },
    iconButton: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    grow: {
      flexGrow: 1,
    },
  })
);


interface IImageLabelListItemProps {
  label: ImageCategoricalLabel;
  labelIndex: number,
  isSelected: boolean,
  onSelect?(labelIndex: number): void;
  onChange?(labelIndex: number): void;
  onDelete?(labelIndex: number): void;
}

function ImageLabelListItem(props: IImageLabelListItemProps) {
  const classes = useStyles();
  const { label, labelIndex } = props;

  const toggleLabelVisible = (label: ImageCategoricalLabel) => (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    label.visible = !label.visible;
    props.onChange?.(props.labelIndex);
    e.preventDefault();
    e.stopPropagation();
  };

  const toggleLabelExpand = (label: ImageCategoricalLabel) => (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    label.open = !label.open;
    props.onChange?.(props.labelIndex);
    e.preventDefault();
    e.stopPropagation();
  };

  const deleteLabelShape = (label: ImageCategoricalLabel, shapeIndex: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    label.deleteShape(shapeIndex);
    props.onChange?.(props.labelIndex);
    e.preventDefault();
    e.stopPropagation();
  }

  const listItemClasses = {
    selected: classes.selected,
    root: label.modified ? classes.listItemModified : undefined
  };

  const onSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    props.onSelect?.(props.labelIndex);
  }

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    props.onDelete?.(props.labelIndex);
  }

  return (
    <React.Fragment>
      <ListItem
        disableRipple
        classes={listItemClasses}
        button={true}
        dense={true}
        selected={props.isSelected}
        onClick={onSelect}>

        {label.visible ? (
          <VisibilityIcon color="secondary" onClick={toggleLabelVisible(label)} fontSize="small" />
        ) : (
            <VisibilityOffIcon color="secondary" onClick={toggleLabelVisible(label)} fontSize="small" />
          )}
        <ListItemText color="inherit" primaryTypographyProps={{ variant: "body2" }}
          primary={label.category ? `${label.categorySetName}:${label.category}` : ''}
          secondary={label.displayType} />
          <IconButton size="small" color="default" style={{ padding: 6 }} onClick={onDelete}>
            <DeleteIcon color="secondary" fontSize="small" />
          </IconButton>
        <ListItemSecondaryAction>
          {label.open ? (
            <ExpandLess color="secondary" onClick={toggleLabelExpand(label)} />
          ) : (
              <ExpandMore color="secondary" onClick={toggleLabelExpand(label)} />
            )
          }
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={label.open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {label.getShapes().map((shape, i) => (
            <ListItem key={i} className={classes.nested}>
              {label.visible ? (
                <VisibilityIcon color="secondary" fontSize="small" />
              ) : (
                  <VisibilityOffIcon color="secondary" fontSize="small" />
                )}
              <ListItemText inset primary={shape.displayString} primaryTypographyProps={{ variant: "body2" }} />
              <IconButton size="small" color="default" onClick={deleteLabelShape(label, i)} style={{ padding: 6 }} >
                <DeleteIcon color="secondary" fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </React.Fragment >
  );
}

export default ImageLabelListItem;
