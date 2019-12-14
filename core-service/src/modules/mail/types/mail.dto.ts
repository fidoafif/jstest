import { ApiModelProperty } from '@nestjs/swagger';
import _ from 'lodash';

export class MailDto {
  @ApiModelProperty()
  id: string;
}

export class FileDto {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
