import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiImplicitFile, ApiUseTags } from '@nestjs/swagger';
import { Response } from 'express';
import fs from 'fs';
import _ from 'lodash';
import * as path from 'path';
import { Readable } from 'stream';
import { Mail } from './mail.entity';
import { MailService } from './mail.service';
import { FileDto } from './types/mail.dto';

@ApiUseTags('Mail')
@Controller('mail')
export class MailController {
  constructor(public service: MailService) {}

  // GET MANY
  @Get('/')
  async getMany(): Promise<any> {
    const response = await this.service.getMany();
    return response;
  }

  // GET ONE
  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<any> {
    try {
      const response = await this.service.getOne(id);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  // GET FILE
  @Get('/open/:id')
  @Header('Content-Type', 'text/csv')
  async getFILE(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const entity = await this.service.getOne(id);
    console.info(entity);
    const status = await fs.existsSync(entity.file);

    if (status) {
      const fileData = await fs.readFileSync(entity.file);
      const stream = new Readable();

      stream.push(fileData);

      stream.push(null);

      res.set({
        'Content-Type': 'text/csv',
        'Content-Length': fileData.length,
        'Content-Disposition':
          'attachment; filename=' + path.basename(entity.file),
      });

      stream.pipe(res);

      // response.writeHead(200, {
      //   'Content-Type': 'application/octet-stream',
      //   'Content-Disposition':
      //     'attachment; filename=' + path.basename(entity.file),
      // });

      // response.pipe(await fs.readFileSync(entity.file));
    }
  }

  // CREATE
  @Post('/')
  async create(@Body() dto: Mail): Promise<any> {
    try {
      const response = await this.service.create(dto);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  // UPDATE
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() dto: Mail): Promise<any> {
    try {
      const response = await this.service.update(id, dto);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  // DELETE
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.service.delete(id);
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Post('upload/:id')
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: FileDto,
  ): Promise<void> {
    try {
      if (!file) {
        throw new HttpException('File Required', HttpStatus.FORBIDDEN);
      }
      await this.service.upload(id, file);
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }
}
