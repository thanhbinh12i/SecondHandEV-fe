import http from "src/utils/http";

const userApiRequests = {
  me: () => http.get("Auth/me"),
};

export default userApiRequests;
