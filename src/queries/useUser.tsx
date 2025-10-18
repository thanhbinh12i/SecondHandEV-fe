import { useQuery } from "@tanstack/react-query";
import userApiRequests from "src/api/user";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: userApiRequests.me,
  });
};
