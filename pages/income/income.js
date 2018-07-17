// pages/simple_list/simple_list.js
import api from '../../config/api';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let title;
        if(options.type == 1) {
            title = '收支方式';
            api.getWays()
                .then(res => {
                    this.setData({
                        list: res
                    })
                })
        } else if(options.type == 2) {
            title = '收入条目';
            api.getIncomeList()
                .then(res => {
                    this.setData({
                        list: res
                    })
                })
        }

        

        wx.setNavigationBarTitle({
            title: title
        })
    }, 

  
})