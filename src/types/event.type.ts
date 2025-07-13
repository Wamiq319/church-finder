export type Event = {
  church: string;
  title: string;
  slug: string;
  address?: string;
  date: string;
  time: string;
  description: string;
  image: string;
  featured: boolean;
  step: number;
  status: "draft" | "published";
  featuredUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
};
