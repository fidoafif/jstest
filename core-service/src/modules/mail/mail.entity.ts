import { HttpException } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import cryptoRandomString from 'crypto-random-string';
import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getRepository,
} from 'typeorm';
import { BaseEntity } from '../base-entity';

@Entity()
export class Mail extends BaseEntity {
  @ApiModelProperty({ required: true })
  @Column()
  name: string;

  @ApiModelProperty({ readOnly: true, required: true })
  @Column({ unique: true, update: false })
  slug: string;

  @ApiModelProperty({ required: true })
  @Column()
  file: string;

  @BeforeInsert()
  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    this.slug = slugify(this.name + '-' + cryptoRandomString({ length: 5 }), {
      replacement: '-',
      lower: true,
    });

    const classRepo = await getRepository(Mail);

    const isExist = await classRepo.findOne({ slug: this.slug });

    if (isExist && isExist.slug !== this.slug) {
      throw new HttpException('Duplicate Slug', 409);
    }
  }
}
