import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  type UserResult,
  type RefreshTokenResult,
  getLogin,
  refreshTokenApi
} from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // Ảnh đại diện
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // Tên người dùng
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // Biệt danh
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // Quyền hạn cấp trang
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // Quyền hạn cấp nút
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // Mã xác minh được tạo từ phía trước (thay thế theo nhu cầu thực tế)
    verifyCode: "",
    // Xác định trang đăng nhập hiển thị thành phần nào (0: đăng nhập (mặc định), 1: đăng nhập bằng điện thoại, 2: đăng nhập bằng mã QR, 3: đăng ký, 4: quên mật khẩu)
    currentPage: 0,
    // Có chọn ghi nhớ đăng nhập hay không
    isRemembered: false,
    // Số ngày ghi nhớ đăng nhập, mặc định là 7 ngày
    loginDay: 7
  }),
  actions: {
    /** Lưu trữ ảnh đại diện */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** Lưu trữ tên người dùng */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** Lưu trữ biệt danh */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** Lưu trữ quyền hạn */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** Lưu trữ quyền hạn cấp nút */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** Lưu trữ mã xác minh được tạo từ phía trước */
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** Lưu trữ trang đăng nhập hiển thị thành phần nào */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** Lưu trữ có chọn ghi nhớ đăng nhập hay không */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** Thiết lập số ngày ghi nhớ đăng nhập */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** Đăng nhập */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data?.success) setToken(data.userInfo);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** Đăng xuất */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /**re`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
