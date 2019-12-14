import fs from 'fs';
import { FileDto } from '../../modules/mail/types/mail.dto';

export const writeFile = (path: string, file: FileDto) => {
  // fs.writeFile('/tmp/test', 'Hey there!', err => {
  //   if (err) {
  //     return console.info(err);
  //   }
  //   console.info('The file was saved!');
  // });

  // Or
  fs.writeFileSync(path, file.buffer);
};

export const deleteFile = (path: string) => {
  // fs.writeFile('/tmp/test', 'Hey there!', err => {
  //   if (err) {
  //     return console.info(err);
  //   }
  //   console.info('The file was saved!');
  // });

  // Or
  fs.unlinkSync(path);
};
