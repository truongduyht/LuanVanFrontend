import axios from "./CusAxios";

// User
const register = async (rawData) => {
  return axios.post("/api/user/register", rawData);
};
const login = async (rawData) => {
  return axios.post("/api/user/login", rawData);
};
const logout = async (rawData) => {
  return axios.get("/api/user/logout");
};
const fecthProfile = async (rawData) => {
  return axios.get("/api/user/fecthProfile");
};
const updateUser = async (rawData) => {
  console.log(rawData);

  return axios.post("/api/user/updateUser", rawData);
};
const getCurrentUser = async (rawData) => {
  return axios.get("/api/user/getCurrentUser");
};
const readPanigation_User = async (rawData) => {
  return axios.get(`/api/user/readPanigation${rawData}`);
};
const getUserById = async (rawData) => {
  console.log(rawData);

  return axios.get(`/api/user/getUserById?${rawData}`);
};
const statistic = async (rawData) => {
  // Gửi UserID dưới dạng tham số truy vấn
  console.log(rawData);

  return axios.get(`/api/booking/statistic?${rawData}`);
};

//Booking
const createBooking = async (rawData) => {
  return axios.post(`/api/booking/createBooking`, rawData);
};
const readPanigation_Booking = async (rawData) => {
  console.log("Data Booking", rawData);

  return axios.get(`/api/booking/readPanigation${rawData}`);
};
const read_Booking = async (rawData) => {
  return axios.get(`/api/booking/read?${rawData}`);
};
const cancel_Booking = async (rawData) => {
  console.log("data cancel booking", rawData);

  return axios.put(`/api/booking/cancelBooking`, rawData);
};
const edit_Booking = async (rawData) => {
  console.log("data edit booking", rawData);
  return axios.put(`/api/booking/editBooking`, rawData);
};
const update_Booking = async (rawData) => {
  console.log("DataUpdate Status", rawData);
  return axios.put(`/api/booking/updateStatus`, rawData);
};
const getBookingsByDate = async (rawData) => {
  console.log("RawData GetBookingByDate", rawData);

  return axios.get(`/api/booking/getBookingsByDate`, rawData);
};
//Review
const createReview = async (rawData) => {
  return axios.post("/api/review/create", rawData);
};
const updateReviewStatus = async (rawData) => {
  return axios.post("/api/review/updateReviewStatus", rawData);
};
const deleteReview = async (rawData) => {
  return axios.delete("/api/review/delete", { data: rawData });
};
const getReviewsByFieldID = async (rawData) => {
  return axios.get(`/api/review/getReviewsByFieldID?id=${rawData.id}`);
};
const readPanigationReview = async (rawData) => {
  console.log("Data Review", rawData);

  return axios.get(`/api/review/readPanigationReview${rawData}`);
};

//Payment
const createPaymentUrl = async (rawData) => {
  return axios.post("/api/payment/create_payment_url", rawData);
};
const vnpay_return = (data) => {
  return axios.get(`/api/payment/vnpay_return?${data}`);
};
//Field
const readPanigate_Field = async (rawData = "") => {
  return axios.get(`/api/field/readPanigate${rawData}`);
};
const readField = async (rawData) => {
  return axios.get(`/api/field/readField?id=${rawData.id}`);
};
const getAvailableTimeSlots = async (rawData) => {
  console.log("RawData getAvailableTimeSlots", rawData);

  // Gọi API bằng axios
  const response = await axios.get(`/api/field/getAvailableTimeSlots`, {
    params: rawData, // Sử dụng params để gửi dữ liệu như query string
  });

  return response; // Trả về phản hồi từ API
};
const getAllField = async () => {
  return axios.get("/api/field/getAllField");
};
//Admin
const createField = async (rawData) => {
  return axios.post("/api/field/create", rawData);
};

const updateField = async (rawData) => {
  // Gửi request POST với formData
  return await axios.post("/api/field/update", rawData, {
    headers: {
      "Content-Type": "multipart/form-data", // Để gửi kèm file
    },
  });
};

const updateFieldStatus = async (rawData) => {
  return axios.post("/api/field/updateFieldStatus", rawData);
};

const deleteField = async (rawData) => {
  return axios.delete("/api/field/delete", { data: rawData });
};
const readPanigate = async (rawData) => {
  return axios.get(`/api/field/readPanigate${rawData}`);
};
const dashboard = async () => {
  return axios.get(`/api/user/dashboard`);
};
const getTotalRevenue = async () => {
  return axios.get("/api/booking/getTotalRevenue");
};
const getRevenueByField = async () => {
  return axios.get("/api/booking/getRevenueByField");
};
const getRevenueByDate = async (rawData) => {
  return axios.get("/api/booking/getRevenueByDate", {
    params: rawData, // rawData sẽ được chuyển thành query params
  });
};
const getRevenueByDateAndField = async (rawData) => {
  console.log(rawData);
  return axios.get("/api/booking/getRevenueByDateAndField", {
    params: rawData, // rawData sẽ được chuyển thành query params
  });
};
const getTotalRevenueByMonth = async (rawData) => {
  return axios.get("/api/booking/getTotalRevenueByMonth", {
    params: rawData, // rawData sẽ được chuyển thành query params
  });
};
const getRevenueByMonthAndField = async (rawData) => {
  console.log(rawData);
  return axios.get("/api/booking/getRevenueByMonthAndField", {
    params: rawData, // rawData sẽ được chuyển thành query params
  });
};
const getFieldsWithAvailableSlots = async (rawData) => {
  console.log(rawData);

  return axios.get(`/api/field/getFieldsWithAvailableSlots${rawData}`);
};

export default {
  register,
  login,
  logout,
  fecthProfile,
  updateUser,
  getCurrentUser,
  getUserById,
  statistic,
  readPanigation_User,
  createField,
  updateField,
  updateFieldStatus,
  deleteField,
  readPanigate,
  readField,
  getAllField,
  getAvailableTimeSlots,
  dashboard,
  readPanigate_Field,
  createBooking,
  readPanigation_Booking,
  read_Booking,
  cancel_Booking,
  edit_Booking,
  update_Booking,
  getBookingsByDate,
  createPaymentUrl,
  getTotalRevenue,
  getRevenueByField,
  vnpay_return,
  getRevenueByDate,
  getRevenueByDateAndField,
  getTotalRevenueByMonth,
  getRevenueByMonthAndField,
  getFieldsWithAvailableSlots,
  createReview,
  updateReviewStatus,
  deleteReview,
  getReviewsByFieldID,
  readPanigationReview,
};
