/**
 * 展示错误提示的Toast
 * @param {错误消息} msg 
 */
const showErrorToast = msg => {
    wx.showToast({
        title: msg,
        icon: 'loading',
        image: '../images/icon_error.png'
    })
}

/**
 * 获取今天的日期 yyyy-MM-dd
 */
const today = () => {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/**
 * 深拷贝
 * @param {拷贝对象} obj 
 */
const deepCopy = obj => {
    var newObj = {};
    if (obj instanceof Array) {
        newObj = [];
    }
    for (var key in obj) {
        var val = obj[key];
        //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
        newObj[key] = typeof val === 'object' ? deepCopy(val): val;
    }
    return newObj;
}



module.exports = {
    showErrorToast,
    today,
    deepCopy
}
