// Served from /public so the static HTML and the hydrated app point at the
// same file. Bundler imports resolve to /src/... during the prerender pass,
// which 404s on the deployed static site.
const assetBase = import.meta.env.BASE_URL || '/';
const directorPortrait = `${assetBase}leadership/israr-siddique.jpg`;
const secondDirectorPortrait = `${assetBase}leadership/g-moinuddin.jpg`;

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