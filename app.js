//app.js
var httpUtils = require('./utils/httpUtils');
var api = require('./config/api.js');

App({
    onLaunch: function () {
        // openid存本地， 如果本地没有，再去登录
        wx.getStorage({
            key: 'account-token',
            success: res => {
                console.log(res);
                this.globalData.token = res.data;
                httpUtils.request(api.updateLastActivityDate, {}, 'POST', false);
            },
            fail: res => {
                // 登录
                httpUtils.login().then(res => {
                    // 请求服务器，使用 code 换取 openid             
                    httpUtils.request(api.login, { code: res.code }).then(res => {
                        let openId = res.wechatOpenid;
                        this.globalData.token = openId;
                        wx.setStorageSync('account-token', openId)
                    })
                });
            }
        })
    },
    globalData: {
        userInfo: null,
        token: '',
    }
})