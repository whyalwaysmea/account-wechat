// pages/member_management/member_management.js
const app = getApp()
import api from '../../config/api';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookId: 0,
        memberRecords: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.bookId = options.bookId;
        api.getMemberRecordStatistics(this.data.bookId)
            .then(res => {
                this.setData({
                    memberRecords: res
                })
            })
    },


    delMember: function(e) {
        wx.showModal({
            title: '删除成员',
            content: '确认删除后，该成员相关记录将会从账本中移除',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                }else{
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