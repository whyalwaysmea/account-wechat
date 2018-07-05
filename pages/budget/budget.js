// pages/budget/budget.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        setBudget: true,
        currentBudget: 0,
        totalBudget: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    
    },

    saveBudget: function() {
        if(this.data.setBudget) {

        } else {
            this.setData({
                setBudget: true
            })
        }
    }
})