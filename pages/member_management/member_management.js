// pages/member_management/member_management.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
    
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    
    },

    delMember: function(e) {
        console.log('delMember ');
        console.log(e);
        wx.showModal({
            title: '删除成员',
            content: '确认删除后，该成员相关记录将会从账本中移除',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    console.log('确认')
                }else{
                    console.log('取消')
                }
            }
        });
    },

    memberDetail: function(e) {
        console.log('memberDetail ' + e);
    },

    addMember: function() {
        wx.showActionSheet({
            itemList: ['微信好友', '家庭成员'],
            success: function(res) {
                if (!res.cancel) {
                    console.log(res.tapIndex)
                }
            }
        });
    }
})