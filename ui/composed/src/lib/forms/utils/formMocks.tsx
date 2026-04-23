import { SelectGroupType } from '../components/select/type';
import { Flag } from 'lucide-react';

export const timezones: SelectGroupType[] = [
  {
    label: 'Americas',
    items: [
      {
        label: '(GMT-5) New York',
        value: 'random-id-1',
      },
      {
        label: '(GMT-8) Los Angeles',
        value: 'random-id-2',
        description: 'West Coast USA',
        icon: <Flag />,
      },
      {
        label: '(GMT-6) Chicago',
        value: 'random-id-3',
      },
      {
        label: '(GMT-5) Toronto',
        value: 'random-id-4',
      },
      {
        label: '(GMT-8) Vancouver',
        value: 'random-id-5',
      },
      {
        label: '(GMT-3) São Paulo',
        value: 'random-id-6',
      },
    ],
  },
  {
    label: 'Europe',
    items: [
      {
        label: '(GMT+1) Paris',
        value: 'random-id-7',
        disabled: true,
      },
      {
        label: '(GMT+1) Berlin',
        value: 'random-id-8',
      },
      {
        label: '(GMT+1) Rome',
        value: 'random-id-9',
      },
      {
        label: '(GMT+1) Madrid',
        value: 'random-id-10',
      },
      {
        label: '(GMT+1) Amsterdam',
        value: 'random-id-11',
      },
    ],
  },
  {
    label: 'Africa',
    items: [
      {
        label: '(GMT+1) Paris',
        value: 'random-id-12',
      },
      {
        label: '(GMT+1) Berlin',
        value: 'random-id-13',
      },
      {
        label: '(GMT+1) Rome',
        value: 'random-id-14',
      },
      {
        label: '(GMT+1) Madrid',
        value: 'random-id-15',
      },
      {
        label: '(GMT+1) Amsterdam',
        value: 'random-id-16',
      },
    ],
  },
  {
    label: 'Asia/Pacific',
    items: [
      {
        label: '(GMT+9) Tokyo',
        value: 'random-id-17',
      },
      {
        label: '(GMT+8) Shanghai',
        value: 'random-id-18',
      },
      {
        label: '(GMT+8) Singapore',
        value: 'random-id-19',
      },
      {
        label: '(GMT+4) Dubai',
        value: 'random-id-20',
      },
      {
        label: '(GMT+11) Sydney',
        value: 'random-id-21',
      },
      {
        label: '(GMT+9) Seoul',
        value: 'random-id-22',
      },
    ],
  },
] as const;
