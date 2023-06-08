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
