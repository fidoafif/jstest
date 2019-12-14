import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { RedisService } from '../../services/redis/redis.service';
import { EPattern } from '../../services/redis/types/pattern';
import { deleteFile, writeFile } from '../../services/utils/writeFile';
import { Mail } from './mail.entity';
import { FileDto } from './types/mail.dto';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Mail)
    protected readonly repository: Repository<Mail>,
    protected readonly redisService: RedisService,
  ) {}

  // GET MANY
  async getMany(): Promise<Mail[]> {
    const response = await this.repository.find();

    for (const item of response) {
      item.file = __dirname + item.file;
    }
    return response;
  }

  // GET ONE
  async getOne(id: string): Promise<Mail> {
    const response = await this.repository.findOne(id);
    // response.file = __dirname + response.file;
    return response;
  }

  // CREATE
  async create(dto: Mail): Promise<Mail> {
    dto.file = `uploads/${dto.name}.csv`;
    const entry = await this.repository.create(dto);
    const entity = await this.repository.save(entry);

    await this.redisService.clearAllCache(EPattern.mail);

    return entity;
  }

  // UPDATE
  async update(id: string, dto: Mail): Promise<Mail> {
    dto.id = id;
    delete dto.file;

    const entity = await this.repository.save(dto);

    await this.redisService.clearAllCache(EPattern.mail);

    return entity;
  }

  // DELETE
  async delete(id: string): Promise<void> {
    const mail = await this.getOne(id);

    if (!mail) {
      throw new HttpException(`Mail does not found`, HttpStatus.NOT_FOUND);
    }

    await this.repository.delete(id);

    deleteFile(mail.file);

    await this.redisService.clearAllCache(EPattern.mail);
  }

  // Upload
  async upload(id: string, file: FileDto): Promise<void> {
    if (!file.mimetype.includes('text/csv')) {
      throw new HttpException(`Support file is csv`, HttpStatus.BAD_REQUEST);
    }

    const mail = await this.getOne(id);

    if (!mail) {
      throw new HttpException(`Mail does not found`, HttpStatus.NOT_FOUND);
    }

    writeFile(mail.file, file);
    // await this.repository.delete(id);
    // await this.redisService.clearAllCache(EPattern.mail);
  }
}
