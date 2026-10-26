import directorPortrait from '@/assets/leadership/israr-siddique.jpg';
import secondDirectorPortrait from '@/assets/leadership/g-moinuddin.jpg';

export interface LeadershipProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  imageObjectPosition?: string;
  biography?: string;
}

export const leadershipProfiles: readonly LeadershipProfile[] = [
  {
    id: 'israr-siddique',
    name: 'Israr Siddique',
    role: 'Director',
    company: 'Dermi Natural Healthcare Pvt Ltd',
    image: directorPortrait,
  },
  {
    id: 'g-moinuddin',
    name: 'G. Moinuddin',
    role: 'Director',
    company: 'Dermi Natural Healthcare Pvt Ltd',
    image: secondDirectorPortrait,
    imageObjectPosition: 'center top',
  },
];