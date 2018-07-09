// pages/book_setting/book_setting.js
const app = getApp()
import api from '../../config/api';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookInfo: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        api.getAccountBookDetails(options.bookId)
            .then(res => {
                this.setData({
                    bookInfo: res
                })
            })
    },

})