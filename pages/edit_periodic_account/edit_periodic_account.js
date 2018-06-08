// pages/edit_periodic_account/edit_periodic_account.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ways: ['收入', '支出'],
        repeat: ['每天', '每周', '每月', '每三月', '自定义'],        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },


    bindPickerChange: function(e) {
        wx.showActionSheet({
            itemList: this.data.ways,
            success: function(res) {
                if (!res.cancel) {
                    console.log(res)
                }
            }
        });
    },


    bindWays: function(e) {
        wx.showActionSheet({
            itemList: this.data.repeat,
            success: function(res) {
                if (!res.cancel) {
                    console.log(res)
                }
            }
        });
    },
})