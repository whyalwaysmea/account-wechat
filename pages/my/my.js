// pages/my/my.js
const app = getApp()
import api from '../../config/api';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: '',
        statistics: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfo: app.globalData.userInfo
        })

        api.getUserStatistics()
            .then(res => {
                this.setData({
                    statistics: res
                })
            })
    },

})