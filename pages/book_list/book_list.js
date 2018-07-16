// pages/book_list/book_list.js
import api from '../../config/api';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        allBook: [],
        bookId: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        this.getData();
    },

    getData: function() {
        api.getAllAccountBook(true)
            .then(res => {
                this.setData({
                    allBook: res
                })
            })
    },
  
    newBook: function() {
        wx.navigateTo({
            url: '../../pages/edit_name/edit_name?type=2'
        })
    },

    delBook: function(e) {
        let bookId = e.currentTarget.dataset.bookid;
        
        wx.showModal({
            title: '删除账本',
            content: '确认删除后，该账本所有记录将消失',
            confirmText: "确认",
            cancelText: "取消",
            success: res => {
                if (res.confirm) {
                    if(this.data.allBook.length == 1) {
                        wx.showToast({
                            title: '留下一点回忆吧',
                            icon: 'none',
                            duration: 1000
                        })
                    } else {
                        api.delBook(bookId)
                        .then(res => {
                            this.getData();
                        })
                    }
                    
                }else{
                }
            }
        });
    },

    changeBook: function(e) {
        let bookId = e.currentTarget.dataset.bookid;
        wx.reLaunch({
            url: `/pages/index/index?bookId=${bookId}`
        })
    }
})