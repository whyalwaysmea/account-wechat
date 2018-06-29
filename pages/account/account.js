// pages/account/account.js
import api from '../../config/api';
import utils from '../../utils/util';
const app = getApp()
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
        tempInputs: [],          // 所有输入
        date: new Date(),       // 显示的日期 mm-dd
        selectedDate: new Date(),   // 选择的日期
        allWays: [],
        allWaysName: [],
        selectWayIndex: 0,
        parties: [],
        tempParties: [],
        showParter: false,
        bookId: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.bookId = options.bookId
        this.data.selectedDate = utils.today();
        this.setData({
            date: this.formatDate(utils.today())
        })

        api.getBookParters(this.data.bookId)
            .then(res => {
                for(let i = 0; i < res.length; i++) {
                    if(res[i].wechatOpenid == app.globalData.token) {
                        res[i].select = true;
                    }
                }
                this.setData({
                    parties: res,
                    tempParties: utils.deepCopy(res),
                })
            })
        
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

        api.getWays()
            .then(res => {
                this.data.allWaysName = res.map(item => {
                    return item.name
                })
                this.data.allWays = res;
                this.setData({
                    allWaysName: this.data.allWaysName
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
        })
        if(type == 1) {
            this.setData({
                childOutput: [],
            })
        } else {
            this.setData({
                childOutput: classList[0].childExpenditure,      
            })
        }
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
            let moneyStr = this.data.money + '';
            let newNum = moneyStr.substring(0, moneyStr.length - 1);
            if(newNum == '') {
                newNum = '0';
            }
            this.setData({
                calculation: newNum,
                money: newNum
            })
        } else if(this.data.tempInputs.length > 0){
            
            let newCalculation;

            if(this.data.tempInput.length > 1) {
                // 此次计算的数字还没有删除完
                this.data.tempInput = this.data.tempInput.substring(0, this.data.tempInput.length - 1);;
                newCalculation = this.data.calculation.substring(0, this.data.calculation.length - 2);
            } else if(this.data.tempInput.length == 1) {
                // 此次计算的数字删完了, 取新值
                this.data.tempInput = this.data.tempInputs.pop();
                newCalculation = this.data.calculation.substring(0, this.data.calculation.length - 3);

                let addLastIndex = newCalculation.lastIndexOf('+');
                let reduceLastIndex = newCalculation.lastIndexOf('-');

                if(this.data.tempResults.length > 1) {
                    this.data.tempResult = this.data.tempResults.pop();
                    this.data.tempResult = this.data.tempResults[this.data.tempResults.length - 1];
    
                    this.data.calculationType = addLastIndex > reduceLastIndex ? 1 : 2;
                } else {
                    this.data.calculationType = 0;
                }
                
            } else {
                this.setData({
                    calculation: this.data.calculation.substring(0, this.data.calculation.length - 1)
                })
                return ;
            }
            
            

            let tempResult = this.data.tempResult;
            let tempInput = this.data.tempInput;

            
            if(this.data.calculationType == 1) {
                // 加
                tempResult = parseFloat(tempResult) + parseFloat(tempInput);
            } else if(this.data.calculationType == 2) {
                // 减
                tempResult = parseFloat(tempResult) - parseFloat(tempInput);
            }
            
            
            if(this.data.tempInputs.length == 0) {
                this.setData({
                    calculation: Math.round(parseFloat(tempResult) * 100) / 100,
                    money: Math.round(parseFloat(tempResult) * 100) / 100
                })
            } else {
                this.setData({
                    calculation: newCalculation + '=',
                    money: Math.round(tempResult * 100) / 100
                })
            }            
            
        }
    },

    /**
     * 清空输入
     */
    clearInput: function() {
        this.data.tempInputs = [];
        this.data.tempResults = [];
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
    record: function() {
        if(this.data.money == '0') {
            wx.showToast({
                title: '请输入金额',
                image: '../../images/icon_error.png'
            })
            return ;
        }
        let partersIds = this.data.parties.filter(item => {
            return item.select
        }).map(item => {
            return item.wechatOpenid
        })
        
        let payIncomeWayId = this.data.allWays[this.data.selectWayIndex].id;
        let param = {
            bookId: this.data.bookId,
            amount: parseFloat(this.data.money) * 100,
            recordType: this.data.moneyType,
            payIncomeWay: payIncomeWayId,
            mainType: this.data.selectedId,
            secondaryType: this.data.selectedTag,
            recordTime: this.data.selectedDate,
            remark: this.data.remark,
            partersId: partersIds
        }
        api.record(param)
            .then(res => {
                console.log('成功');
            })
            .catch(error => {
                console.log(erroe);
            })
    },

    bindDateChange: function(e) {
        this.data.selectedDate = e.detail.value;
        let formatDate = this.formatDate(e.detail.value);
        this.setData({
            date: formatDate
        })
    },

    formatDate: function(date) {
        return date.substring(5, date.length)
    },

    bindWaysChange: function(e) {
        this.setData({
            selectWayIndex: e.detail.value
        })
    },

    bindParter: function(e) {
        this.setData({
            showParter: true
        })
    },

    cancelSelectParter: function(e) {
        this.setData({
            showParter: false,
            tempParties: utils.deepCopy(this.data.parties)
        })
    },

    confirmSelectPater: function(e) {
        this.setData({
            showParter: false,
            parties: utils.deepCopy(this.data.tempParties)
        })
    },

    bindItemParter: function(e) {
        let index = e.currentTarget.dataset.index;
        let tempParties = this.data.tempParties;
        if(tempParties[index].select) {
            tempParties[index].select = false;
        } else {
            tempParties[index].select = true;
        }
        this.setData({
            tempParties: tempParties
        })
    },

})