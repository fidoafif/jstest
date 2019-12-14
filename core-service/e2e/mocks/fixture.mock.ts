import { CreateClassDto } from '../../src/modules/class/types/class.dto';
import { EClassType } from '../../src/modules/class/types/class.enum';

export const fixtureClassData: Partial<CreateClassDto> = {
  title: 'string',
  description: 'string',
  type: EClassType.course,
  user_id: 'string',
  updated_by: 'string',
  term_and_condition: 'string',
  featured: true,
  premium: true,
  featured_file_id: 'string',
  preview_file_id: 'string',
  enrolled: 0,
  length: 'string',
  effort: 'string',
  meta: {
    channel: 'CHANNEL_NAME',
    channel_id: 'CHANNEL_ID',
    categories: [
      {
        category: 'CATEGORY_NAME',
        category_id: 'CATEGORY_ID',
        sub_categories: [
          {
            sub_category: 'SUB_CATEGORY_NAME',
            sub_category_id: 'SUB_CATEGORY_ID',
          },
        ],
      },
    ],
    series: [
      {
        series: 'SERIES_NAME',
        series_id: 'SERIES_ID',
      },
    ],
  },
  syllabus: ['string'],
};
