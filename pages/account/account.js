// pages/account/account.js
import api from '../../config/api';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        moneyType: 2,           // 1. 收入 2. 支出
        output: [],             // 支出分类
        childOutput: [],        // 支出子分类
        classList: [],          // 支出分类
        income: [],             // 收入分类
        selectedName: '',       // 选择的分类名称
        selectedUrl:'',         // 选择的分类icon
        selectedId: '',         // 选择的分类id
        selectedTag: '',        // 选择的次级分类id
        remark: '',             // 备注信息
        editRemark: false,      // 是否编辑备注
        money: '0',             // 金额
        calculation: '',        // 结算过程
        calculationType: 0,     // 0表示没有计算 1表示加 2表示减 
        tempResult: 0,          // 结算过程中间结果
        tempResults: [],        // 所有的中间结果
        tempInput: '',          // 结算过程中间输入
        tempInputs: []          // 所有输入
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

    /**
     * 修改收支
     */
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

    /**
     * 修改分类
     */
    changeClassType: function(e) {
        let index = e.currentTarget.dataset.index;
        let classType = this.data.classList[index];
        this.setData({
            selectedId: classType.id,
            selectedUrl: classType.iconUrl,
            selectedName: classType.name,
            childOutput: classType.childExpenditure
        })
    },

    /**
     * 修改次级分类
     */
    changeTag: function(e) {
        let index = e.currentTarget.dataset.index;
        let classType = this.data.childOutput[index];
        this.setData({
            selectedTag: classType.id
        })
    },

    /**
     * 显示备注
     */
    editRemark: function() {
        this.setData({
            editRemark: true
        })
    },

    /**
     * 备注输入监听
     */
    inputRemark: function(e) {
        this.setData({
            remark: e.detail.value
        })
    },
    
    /**
     * 数字输入
     */
    inputNum: function(e) {
        let num = e.currentTarget.dataset.num;
        if(num != '+' && num != '-') {
            // 有小数点就不能再输小数点  && 避免0000.xxx 0...xxx 情况
            if((this.data.tempInput.indexOf('.') > 0 && num == '.') || (this.data.tempInput.indexOf('0') == 0 && (num == '.' || num == '0') && this.data.tempInput.length == 1 )) {
                return ;
            }
            let newNum = num;

            if(this.data.money !== '0') {                
                newNum = this.data.money + num;
            } else if(this.data.money == 0 && num == '.') {
                newNum = '0.';
            } 
            
            if(this.data.tempInput == '' && num == '.') {
                this.data.tempInput = '0.';
                num = "0.";
            } else {
                this.data.tempInput = this.data.tempInput + num;
            }
                                    

            // 计算过程
            if(this.data.calculationType == 0) {    
                this.data.tempResult = newNum;           
                this.setData({
                    calculation: newNum,
                    money: newNum
                })
            } else {                
                let calculation = this.data.calculation + num;
                calculation = calculation.replace('=', '');
                calculation += '=';
                

                let tempResult = this.data.tempResult;
                let tempInput = this.data.tempInput;
                if(this.data.calculationType == 1) {
                    // 加
                    tempResult = parseFloat(tempResult) + parseFloat(tempInput);
                } else {
                    // 减
                    tempResult = parseFloat(tempResult) - parseFloat(tempInput);
                }
                this.setData({
                    calculation: calculation,
                    money: Math.round(tempResult * 100) / 100
                })
            }            
        } else if(this.data.money !== '0') {

            if(num == '+') {
                this.data.calculationType = 1;
            } else {
                this.data.calculationType = 2;
            }
            this.data.tempInputs.push(this.data.tempInput);
            this.data.tempInput = '';

            this.data.tempResult = this.data.money;
            this.data.tempResults.push(this.data.money);
            
            let calculation = this.data.calculation + num;
            calculation = calculation.replace('=', '');
            this.setData({
                calculation: calculation
            })
        }

    },

    /**
     * 后退一格
     */
    backOneStep: function() {
        if(this.data.calculationType == 0) {
            let newNum = this.data.money.substring(0, this.data.money.length - 1);
            if(newNum == '') {
                newNum = '0';
            }
            this.setData({
                calculation: newNum,
                money: newNum
            })
        } else {
            let addLastIndex = this.data.calculation.lastIndexOf('+');
            let reduceLastIndex = this.data.calculation.lastIndexOf('-');
            let newCalculation;


            if(this.data.tempInput.length > 1) {
                // 此次计算的数字还没有删除完
                this.data.tempInput = this.data.tempInput.substring(0, this.data.calculation.length - 1);;
                newCalculation = this.data.calculation.substring(0, this.data.calculation.length - 2);
            } else if(this.data.tempInput.length == 1) {
                // 此次计算的数字删完了
                this.data.tempInput = this.data.tempInputs.pop();
                newCalculation = this.data.calculation.substring(0, this.data.calculation.length - 3);

                this.data.tempResult = this.data.tempResults.pop();
                this.data.calculationType = addLastIndex > reduceLastIndex ? 1 : 2;
            }
            
            

            let tempResult = this.data.tempResult;
            let tempInput = this.data.tempInput;
            if(this.data.calculationType == 1) {
                // 加
                tempResult = parseFloat(tempResult) + parseFloat(tempInput);
            } else {
                // 减
                tempResult = parseFloat(tempResult) - parseFloat(tempInput);
            }
            if(this.data.tempInputs.length == 0) {
                this.setData({
                    calculation: Math.round(tempResult * 100) / 100,
                    money: Math.round(tempResult * 100) / 100
                })
            } else {
                this.setData({
                    calculation: newCalculation + '=',
                    money: Math.round(tempResult * 100) / 100
                })
            }
            
            if(tempInput == '0' && this.data.tempInput.length > 1) {
                this.data.tempInput = this.data.tempInput.substring(0, this.data.tempInput.length - 1);
            }
            
        }
    },

    /**
     * 清空输入
     */
    clearInput: function() {
        this.setData({
            tempInput:  '',
            tempResult: '',
            calculation: 0,
            calculationType: 0,
            money: '0',
        })        
    },

    /**
     * 记录
     */
    overInput: function() {

    }
})