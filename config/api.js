const baseUrl = 'http://127.0.0.1:8088/api';

module.exports = {
    // 用户相关
    login: baseUrl + '/user/login',                                     // 登录
    updateLastActivityDate: `${baseUrl}/user/updateLastActivityDate`,   // 更新用户最后活动时间

};