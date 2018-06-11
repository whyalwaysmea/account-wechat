var api = require('../config/api.js');

// HTTP工具类，参考https://github.com/tumobi/nideshop-mini-program/blob/master/utils/util.js
function request(url, data = {}, method = "GET", showLoading = true) {
    if(showLoading) {
        wx.showLoading({
            title: '加载中',
        })
    }
    
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': 'application/json',
                'X-Nideshop-Token': wx.getStorageSync('token')
            },
            success: function (res) {                
                if(showLoading) {
                    wx.hideLoading();
                }

                if (res.statusCode == 200 && res.data.success == true) {                    
                    resolve(res.data.value);                    
                } else {
                    showErrorToast('服务器错误!');
                    reject(res);
                }
            },
            fail: function (err) {
                if(showLoading) {
                    wx.hideLoading();
                }
                reject(err.message)
                showErrorToast('服务器错误!');
            }
        })
    });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
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

  /**
 * 调用微信登录
 */
function login() {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (res) {
                if (res.code) {
                    //登录远程服务器
                    console.log(res)
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}
  
function getUserInfo() {
    return new Promise(function (resolve, reject) {
        wx.getUserInfo({
            withCredentials: true,
                success: function (res) {
                console.log(res)
                resolve(res);
            },
            fail: function (err) {
                reject(err);
            }
        })
    });
}

function showErrorToast(msg) {
    wx.showToast({
        title: msg,
        image: '../images/icon_error.png'
    })
}


module.exports = {
    request,
    showErrorToast,
    checkSession,
    login,
    getUserInfo,
}