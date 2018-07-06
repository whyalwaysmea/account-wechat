// pages/budget/budget.js
import api from '../../config/api';
import util from '../../utils/util';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        setBudget: true,
        currentBudget: 0,
        totalBudget: 0,
        bookId: 0,
        setAmount: '',
        percent: 90,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.currentBudget = options.surplusBudgetaryAmount;
        this.data.bookId = options.bookId;

        if(options.totalBudget) {
            this.data.percent = parseInt(options.surplusBudgetaryAmount / options.totalBudget * 100);
            this.setData({
                setBudget: false,
                currentBudget: options.surplusBudgetaryAmount,
                totalBudget: options.totalBudget
            })
        } 
    },

    bindKeyInput: function(e) {
        this.setData({
            setAmount: e.detail.value
        })
    },

    saveBudget: function() {
        if(this.data.setBudget) {
            if(isNaN(this.data.setAmount)) {
                return ;
            }
            let param = {
                budgetaryAmount: this.data.setAmount * 100
            }
            api.updateAccountBook(this.data.bookId, param)
                .then(res => {
                    let percent = parseInt(res.surplusBudgetaryAmount / res.budgetaryAmount * 100);
                    console.log(percent);
                    this.setData({
                        setBudget: false,
                        currentBudget: res.surplusBudgetaryAmount,
                        totalBudget: res.budgetaryAmount,
                        percent: percent
                    })
                })
        } else {
            this.setData({
                setBudget: true
            })
        }
    }
})