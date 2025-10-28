import { useQuery } from "@tanstack/react-query";
import userApiRequests from "src/api/user";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: userApiRequests.me,
  });
};

export const useGetUserList = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: ["userLists", params],
    queryFn: () => userApiRequests.userList(params),
  });
};
