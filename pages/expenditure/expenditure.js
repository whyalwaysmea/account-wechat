// pages/expenditure/expenditure.js
import api from '../../config/api';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        childList: [],
        selectedIndex: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        api.getExpenditureList()
            .then(res => {
                this.setData({
                    list: res,
                    childList: res[this.data.selectedIndex].childExpenditure
                })
            })
    },

    changeChild: function(e) {
        this.data.selectedIndex = e.currentTarget.dataset.index;
        this.setData({
            selectedIndex: this.data.selectedIndex,
            childList: this.data.list[this.data.selectedIndex].childExpenditure
        })
    }
})