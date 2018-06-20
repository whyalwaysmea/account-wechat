// pages/account/account.js
import api from '../../config/api';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        moneyType: 2,       // 1. 收入 2. 支出
        output: [],         // 支出分类
        childOutput: [],    // 支出子分类
        classList: [],      // 支出分类
        income: [],         // 收入分类
        selectedName: '',   // 选择的分类名称
        selectedUrl:'',     // 选择的分类icon
        selectedId: '',     // 选择的分类id
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        api.getExpenditureList()
            .then(res => {
                this.setData({
                    output: res,
                    selectedId: res[0].id,
                    selectedUrl: res[0].iconUrl,
                    selectedName: res[0].name,
                    childOutput: res[0].childExpenditure,
                    classList: res,
                })
            });
        
        api.getIncomeList()
            .then(res => {
                this.setData({
                    income: res
                })                
            })    
    },

    changeMoenyType: function(e) {
        let type = e.currentTarget.dataset.moneytype;
        let classList = type == 1 ? this.data.income : this.data.output;
    
        this.setData({
            moneyType: type,
            classList: classList,
            selectedId: classList[0].id,
            selectedUrl: classList[0].iconUrl,
            selectedName: classList[0].name,
            childOutput: classList[0].childExpenditure,
        })
    },

    changeClassType: function(e) {
        let index = e.currentTarget.dataset.index;
        let classType = this.data.classList[index];
        this.setData({
            selectedId: classType.id,
            selectedUrl: classType.iconUrl,
            selectedName: classType.name,
            childOutput: classType.childExpenditure
        })
    }
})