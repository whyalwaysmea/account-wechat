// pages/book_list/book_list.js
import api from '../../config/api';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        allBook: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        api.getAllAccountBook(true)
            .then(res => {
                this.setData({
                    allBook: res
                })
            })
    },

  
})