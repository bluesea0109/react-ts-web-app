import List from '@material-ui/core/List';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  getLabels,
  getSelectedLabelIndex,
} from '../../../store/image-labeling/selectors';
import ImageLabelListItem from './ImageLabelListItem';

interface IImageLabelListProps {
  editable?: boolean;
}

const ImageLabelList: React.FC<IImageLabelListProps> = (props) => {
  const labels = useSelector(getLabels);
  const selectedLabelIndex = useSelector(getSelectedLabelIndex);

  return (
    <List component="nav">
      {labels.map((label, i) => {
        return (
          <ImageLabelListItem
            editable={props.editable ?? false}
            key={i}
            label={label}
            labelIndex={i}
            selected={selectedLabelIndex === i}
          />
        );
      })}
    </List>
  );
};

export default ImageLabelList;
