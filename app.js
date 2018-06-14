//app.js
import api from './config/api';

App({
    onLaunch: function () {        
        // openid存本地， 如果本地没有，再去登录
        wx.getStorage({
            key: 'account-token',
            success: res => {
                this.globalData.token = res.data;
                api.updateLastActivityDate()
                    .then(res => {
                        if(!res.defaultAccount) {
                            // 授权
                            this.globalData.needAuthorize = true;
                        } else {
                            this.globalData.defaultAccountId = res.defaultAccount;
                        }
                        console.log(this.globalData.defaultAccountId);
                        if (this.userInfoReadyCallback) {
                            this.userInfoReadyCallback(res)
                        }
                    });
            },
            fail: res => {
                // 登录
                api.login().then(res => {
                    console.log(res);
                    let openId = res.wechatOpenid;
                    this.globalData.token = openId;
                    wx.setStorageSync('account-token', openId)
                    if(!res.defaultAccount) {
                        // 授权
                        this.globalData.needAuthorize = true;
                    } else {
                        this.globalData.defaultAccountId = res.defaultAccount;
                    }

                    if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res)
                    }
                });
            }
        })



        // 获取用户信息
        wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    this.globalData.userInfo = res.userInfo
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                    }
                  }
                })
              }
            }
          })
    },
    globalData: {
        userInfo: null,
        token: '',
        needAuthorize: false,       // 是否需要授权
        defaultAccountId: '',
    }
})