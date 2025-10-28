export interface MemberDto {
  memberId: number;
  displayName?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  fullName?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
}

export interface AdminMemberDto {
  memberId?: number;
  displayName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  fullName?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
  totalListings?: number;
  totalOrders?: number;
  totalReviews?: number;
}

export interface UserListResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  users: AdminMemberDto[];
}
