// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code : ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var app = getApp();
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          that.setData({
            code: res.code
          })
          wx.request({
            url: app.globalData.serviceBase + '/user/login',
            data: {
              code: res.code
            },
            success: function (res){
              if (res.data.code == 200){
                app.globalData.token = res.data.data;
                wx.switchTab({
                  url: '../index/index'
                })
              }else{
                wx.showModal({
                  title: '提示',
                  content: "该微信号未注册，本小程序暂未开放公开注册！请联系管理员",
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                    }
                  }
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})