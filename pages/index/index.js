//index.js
//获取应用实例
const app = getApp()
import api from '../../config/api';

Page({
    data: {
        showAuthorize: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        accountInfo: null,
        avatars: [],
    },

    onLoad: function () {
        if(app.globalData.needAuthorize && this.data.canIUse) {
            // 需要授权按钮
            this.setData({
                showAuthorize: true
            })
        } else if(app.globalData.needAuthorize) {
            wx.getUserInfo({
                success: res => {                    
                    let userInfo = res.userInfo;
                    this.updateUserInfo(userInfo);                    
                }
            })
        } else {
            this.getAccountBook(app.globalData.defaultAccountId);
        }
        
    },

    getUserInfo: function (e) {
        let userInfo = e.detail.userInfo
        this.setData({
            showAuthorize: false
        })

        // 同步用户信息
        this.updateUserInfo(userInfo);
    },

    updateUserInfo: function(e) {
        if(app.globalData.needAuthorize) {
            e.createBook = true;
        }
        
        api.updateUserInfo(e)
            .then(res => {
                app.globalData.needAuthorize = false;
                app.globalData.defaultAccountId = res.defaultAccount;
                this.getAccountBook(app.globalData.defaultAccountId);
            })
    },


    getAccountBook: function(id) {
        api.getAccountBookDetails(id).then(res => {
            wx.setNavigationBarTitle({
                title: res.name
            })

            let avatars = res.participants.map(part => {
                return part.avatarUrl;
            });
            this.setData({
                avatars: avatars,
                accountInfo: res
            })
        })


        api.getRecordList(id, 1).then(res => {
            console.log(res);
        });
    },

    setBudgetary: function() {
        console.log('设置预算');
    }
})
