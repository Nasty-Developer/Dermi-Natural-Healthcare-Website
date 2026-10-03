import directorPortrait from '@/assets/leadership/israr-siddique.jpg';
import secondDirectorPortrait from '@/assets/leadership/g-moinuddin.jpg';

export interface LeadershipProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  biography?: string;
}

export const leadershipProfiles: readonly LeadershipProfile[] = [
  {
    id: 'israr-siddique',
    name: 'Israr Siddique',
    role: 'Director',
    company: 'Dermi Natural Healthcare Pvt Ltd',
    image: directorPortrait,
    imageWidth: 1086,
    imageHeight: 1448,
  },
  {
    id: 'g-moinuddin',
    name: 'G. Moinuddin',
    role: 'Director',
    company: 'Dermi Natural Healthcare Pvt Ltd',
    image: secondDirectorPortrait,
    imageWidth: 704,
    imageHeight: 1524,
  },
];