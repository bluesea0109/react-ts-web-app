import JSZip from 'jszip';
import _ from 'lodash';
import { IAgentArchiveFiles } from './types';

export const readAgentZipfile = async (
  file: File,
): Promise<IAgentArchiveFiles> => {
  const result: IAgentArchiveFiles = {
    uroImages: [],
    botIcons: [],
  };
  const zip = await JSZip.loadAsync(file);

  for (const key of Object.keys(zip.files)) {
    const file = zip.files[key];
    if (!file.dir && key.slice(-5) === '.json') {
      result.agentConfig = await file.async('string');
    } else if (!file.dir && key.indexOf('uro-images') >= 0) {
      const name = _.last(file.name.split('/')) || file.name;
      const blob = await file.async('blob');

      result.uroImages?.push(blobToFile(blob, name));
    } else if (!file.dir && key.indexOf('bot-icons') >= 0) {
      const name = _.last(file.name.split('/')) || file.name;
      const blob = await file.async('blob');
      result.botIcons?.push(blobToFile(blob, name));
    }
  }

  return result;
};

const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, { lastModified: Date.now() });
};
