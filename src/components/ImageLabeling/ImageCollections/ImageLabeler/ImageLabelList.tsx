import List from '@material-ui/core/List';
import React from 'react';
import { useSelector } from 'react-redux';
import { getLabels, getSelectedLabelIndex } from '../../../../store/image-labeling/selectors';
import ImageLabelListItem from './ImageLabelListItem';

function ImageLabelList() {
  const labels = useSelector(getLabels);
  const selectedLabelIndex = useSelector(getSelectedLabelIndex);

  return (
    <List component="nav">
      {labels.map((label, i) => {
        return (
          <ImageLabelListItem key={i} label={label} labelIndex={i} selected={selectedLabelIndex === i} />
        );
      })}
    </List>
  );
}
export default ImageLabelList;
