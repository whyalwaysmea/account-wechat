//index.js
//获取应用实例
const app = getApp()
import api from '../../config/api';
import util from '../../utils/util';

Page({
    data: {
        showAuthorize: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        accountInfo: null,
        avatars: [],
        bookId: 0,
        defaultDate: '',
        recordList: [],
        isRefresh: false,
    },

    onLoad: function (options) {
        this.data.defaultDate = util.currentMonth();
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
            let bookId;
            if(options.bookId) {
                bookId = options.bookId;
            } else {
                bookId = wx.getStorageSync('defaultAccountId');
            }
            
            this.getAccountBook(bookId, this.data.defaultDate);
        }
        
    },

    onShow: function() {

    },

    getUserInfo: function (e) {
        let userInfo = e.detail.userInfo
        app.globalData.userInfo = userInfo;
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
                wx.setStorageSync('defaultAccountId', app.globalData.defaultAccountId);
                this.getAccountBook(app.globalData.defaultAccountId, this.data.defaultDate);
            })
    },


    getAccountBook: function(bookId, page) {
        api.getAccountBookDetails(bookId).then(res => {
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


        api.getRecordList(bookId, page).then(res => {
            this.setData({
                recordList: res
            })
        });
    },

    setBudgetary: function() {
        wx.navigateTo({
            url: `../../pages/budget/budget?bookId=${this.data.bookId}&totalBudget=${this.data.accountInfo.budgetaryAmount}&surplusBudgetaryAmount=${this.data.accountInfo.surplusBudgetaryAmount}`
        })
    },

    record: function(e) {
        wx.navigateTo({
            url: '../../pages/account/account?bookId=' + this.data.bookId
        })
    },

    selectBook: function() {
        api.getAllAccountBook(false)
        .then(allBook => {
            let bookNames = allBook.map(item => {
                return item.name
            })
            wx.showActionSheet({
                itemList: bookNames,
                success: (res) => {
                    if (!res.cancel) {
                        let bookId = allBook[res.tapIndex].bookId;
                        wx.redirectTo({
                            url: `/pages/index/index?bookId=${bookId}`
                        })
                    }
                }
            });
        })        
    }
})
