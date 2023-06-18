import { User } from '@prisma/client';

export interface UserGroupResponse {
  id: number;
  name: string;
  description: string;
  bannerImageUrl: string;
  isActive: boolean;
  isOwner: boolean;
  joined: boolean;
  members: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface GroupEventResponse {
  id: number;
  name: string;
  isActive: boolean;
  eventDate: Date;
  eventImageUrl: string;
  createUserId: number;
  createUserName: string;
  createUserImageUrl: string;
}
