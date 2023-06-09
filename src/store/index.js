import { defineStore } from 'pinia';

export const mainStore = defineStore('main', {
  state: () => {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
      loginOrSign: false,
      loginBoolean: false,
    };
  },
  getters: {
    showUser(state) {
      return Object.keys(state.userInfo).length === 0 ? false : true;
    },
    userDeail(state) {
      return state.userInfo;
    },
  },
  actions: {
    LoginBoolean(Boolean) {
      this.loginBoolean = Boolean;
    },
    LoginOrSign(Boolean) {
      this.loginOrSign = Boolean;
    },
    setUserInfo(info) {
      this.userInfo = info;
    },
  },
});
