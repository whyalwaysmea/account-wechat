//app.js
var httpUtils = require('./utils/httpUtils');
var api = require('./config/api.js');

App({
    onLaunch: function () {
        httpUtils.request(api.AuthLoginByWeixin, {}, 'POST', true)
            .then(res => {
                console.log(res);
            })
    },
    globalData: {
        userInfo: null
    }
})