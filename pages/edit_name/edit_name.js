// pages/edit_name/edit_name.js
import api from '../../config/api';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        oldValue: '',
        value: '',
        type: 0,            // 1-账本名称
        bookId: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            oldValue: options.value,
            type: options.type,
            bookId: options.bookId
        })
    },

    clear: function() {
        this.setData({
            value: ''
        })
    },

    save: function() {
        if(this.data.type == 1) {
            let param = {
                name: this.data.value
            }
            api.updateAccountBook(this.data.bookId, param)
                .then(res => {
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 500,
                        success: res => {
                            var pages = getCurrentPages();
                            if(pages.length > 1){ 
                                var prePage = pages[pages.length - 2];
                                prePage.changeName(this.data.value)
                            }
                            wx.navigateBack();
                        }
                    })
                });
        }
    },

    bindKeyInput: function(e) {
        this.setData({
            value: e.detail.value
        })
    },
})