// HTTP工具类，参考https://github.com/tumobi/nideshop-mini-program/blob/master/utils/util.js
import util from '../utils/util';

export default class httpUtils {
    /**
     * 发起网络请求
     * @param {} url  请求url
     * @param {*} data 请求数据参数
     * @param {*} method   请求方式
     * @param {*} showLoading  是否显示loading
     */
    static request(url, data = {}, method = "GET", showLoading = true) {
        if (showLoading) {
            wx.showLoading({
                title: '加载中',
            })
        }

        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                data: data,
                method: method,
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': wx.getStorageSync('account-token')
                },
                success: (res) => {
                    if (showLoading) {
                        wx.hideLoading();
                    }

                    if (res.statusCode == 200 && res.data.success == true) {
                        resolve(res.data.value);
                    } else {
                        wx.showToast({
                            title: '服务器错误',
                            image: '../images/icon_error.png'
                        })
                        reject(res);
                    }
                },
                fail: (err) => {
                    if (showLoading) {
                        wx.hideLoading();
                    }
                    reject(err.message)
                    wx.showToast({
                        title: '服务器错误',
                        image: '../images/icon_error.png'
                    })
                }
            })
        });
    }

    /**
     * 检查微信会话是否过期
     */
    static checkSession() {
        return new Promise(function (resolve, reject) {
            wx.checkSession({
                success: function () {
                    resolve(true);
                },
                fail: function () {
                    reject(false);
                }
            })
        });
    }


    static getUserInfo() {
        return new Promise(function (resolve, reject) {
            wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                    resolve(res);
                },
                fail: function (err) {
                    reject(err);
                }
            })
        });
    }
    
}

