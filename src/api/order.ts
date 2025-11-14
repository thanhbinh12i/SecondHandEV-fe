import http from "src/utils/http";

const paymentApiRequests = {
  createPayOS: (id: number) =>
    http.post(`payos/create-payment-link`, "Thanh toán", {
      params: { listingId: id },
    }),
};

export default paymentApiRequests;
