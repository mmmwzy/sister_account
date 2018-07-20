//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    token: '',
    serviceBase: 'https://www.mie-value.com/mie_sister_account'
    // serviceBase: 'http://127.0.0.1:10300'
  },
  toFix: function (value, count) {
    var num = Number(value)
    return num.toFixed(count)
  },
  validateToken: function(res){
    if (res.data.code == '1407'){
      wx.showModal({
        title: '提示',
        content: res.data.msg + "点击确定跳往登陆页面",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login'　// 页面 A
            })
          }
        }
      })
    }
  },
  gloadTipNoNext: function(msg){
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
        }
      }
    })
  }
})