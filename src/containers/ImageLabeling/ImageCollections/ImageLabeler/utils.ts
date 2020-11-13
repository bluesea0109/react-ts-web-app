import { IImageLabel } from '../../../../models/image-labeling-service';
import ImageCategoricalLabel from '../../models/labels/ImageLabel';

export const convertLabels = (
  imageLabels: IImageLabel[],
): ImageCategoricalLabel[] => {
  const labels = [];
  for (const labelData of imageLabels) {
    const label = ImageCategoricalLabel.fromServerData(labelData);
    labels.push(label);
  }
  return labels;
};
