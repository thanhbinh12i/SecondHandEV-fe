import { UserListResponse } from "src/types/user.type";
import http from "src/utils/http";

const userApiRequests = {
  me: () => http.get("Auth/me"),
  userList: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
  }) => {
    return http.get<UserListResponse>("Admin/users", { params });
  },
};

export default userApiRequests;
