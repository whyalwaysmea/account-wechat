const baseUrl = 'http://127.0.0.1:8088/api';
import httpUtils from '../utils/httpUtils';

export default class api extends httpUtils {
    // 用户相关

    // 登录
    static login() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (res) => {
                    let url = `${baseUrl}/user/login`;
                    this.request(url, {code: res.code}).then(res => {
                        resolve(res);
                    }); 
                },
                fail: function (err) {
                    reject(err);
                }
            })
        });
    }                                     

    // 更新用户最后活动时间
    static updateLastActivityDate() {
        return this.request(`${baseUrl}/user/updateLastActivityDate`, {}, 'POST', false);
    }

    // 更新用户信息
    static updateUserInfo(param) {
        return this.request(`${baseUrl}/user/updateInfo`, param, 'POST', false);
    }

    /**
     * 账本详情
     * @param {*} id 账本id
     */
    static getAccountBookDetails(id) {
        return this.request(`${baseUrl}/accountbook/${id}`, {}, 'GET');
    }

    /**
     * 获取记录列表
     * @param  id 账本id
     * @param  page 页码
     */
    static getRecordList(id, page) {
        return this.request(`${baseUrl}/record/${id}`, {page, page});
    }


    /**
     * 获取支出分类列表
     */
    static getExpenditureList() {
        return this.request(`${baseUrl}/expenditure/list`);
    }

    /**
     * 获取收入分类列表
     */
    static getIncomeList() {
        return this.request(`${baseUrl}/income/list`);
    }
};