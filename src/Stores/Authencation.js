import { defineStore } from "pinia";
import Service from "../Services/API"; // Giả sử Service là nơi bạn gọi API

export const authenticationStore = defineStore("authentication", {
  state: () => ({
    _user: {
      _id: "",
      _UserName: "",
      _PhoneNumber: "",
      _Email: "",
      _Role: "",
    },
    _loading: true,
    _isLogin: false,
  }),

  getters: {
    getUserData(state) {
      return state._user;
    },
    getLoading(state) {
      return state._loading;
    },
    getState(state) {
      return state;
    },
  },

  actions: {
    getUser() {
      return this._user;
    },

    getStateLogin() {
      return this._isLogin;
    },
    setIsLogin(state) {
      this._isLogin = state;
    },
    setLoading(state) {
      this._loading = state;
    },

    // Đăng xuất
    logout() {
      this._user = {
        _id: "",
        _UserName: "",
        _PhoneNumber: "",
        _Email: "",
        _Role: "",
      };
      this._isLogin = false;
    },

    // Đặt thông tin người dùng và trạng thái đăng nhập
    setUserAndLogin(tokenData) {
      const { Id, UserName, PhoneNumber, Email, Role } = tokenData;

      this._user._id = Id;
      this._user._UserName = UserName;
      this._user._PhoneNumber = PhoneNumber;
      this._user._Email = Email;
      this._user._Role = Role;

      this._isLogin = true;
    },

    // Hàm fetchUser để lấy thông tin người dùng từ API
    async fetchUser() {
      this.setLoading(true); // Bắt đầu trạng thái loading
      try {
        // Giả sử bạn có một API khác để lấy thông tin người dùng dựa trên ID
        const id = this._user._id; // Lấy ID người dùng từ state

        if (!id) {
          throw new Error("User ID is not available");
        }

        const res = await Service.getUserById(`id=${id}`); // Gọi API để lấy thông tin người dùng
        const userData = res.data.DT;
        if (res.data.EC === "0") {
          // Cập nhật dữ liệu người dùng từ kết quả API
          this._user = {
            _id: userData._id || "",
            _UserName: userData.UserName || "",
            _PhoneNumber: userData.PhoneNumber || "",
            _Email: userData.Email || "",
            _Role: userData.Role || "",
          };

          this._isLogin = true; // Đánh dấu trạng thái là đã đăng nhập
        } else {
          console.error("Lỗi từ API:", res.data.EM);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        this.setLoading(false); // Kết thúc trạng thái loading
      }
    },
  },
});
