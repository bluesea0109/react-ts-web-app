import axios from 'axios';
import FileType from 'file-type';
import isSvg from 'is-svg';

export const uploadImageFile = async (
  file: File,
  url: string,
): Promise<any> => {
  const buffer = await file.arrayBuffer();
  let mime;
  if (isSvg(Buffer.from(buffer))) {
    mime = 'image/svg+xml';
  } else {
    const fileType = await FileType.fromBuffer(await file.arrayBuffer());
    mime = fileType?.mime;
  }
  console.log('file type', mime);

  await axios.put(url.replace(/"/g, ''), file, {
    headers: {
      'Content-Type': mime,
      'Access-Control-Allow-Origin': '*',
    },
  });
};
