export interface ChurchData {
  name: string;
  denomination: string;
  description: string;
  address: string;
  state: string;
  city: string;
  pastorName: string;
  pastorEmail: string;
  pastorPhone: string;
  contactEmail: string;
  contactPhone: string;
  services: [string, ...string[]];
  image?: string;
  latitude?: number;
  longitude?: number;
  isFeatured?: boolean;
  step: number;
  status: string;
}
