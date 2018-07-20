// pages/my/my.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    uid: '',
    userName: '正在读取...',
    userPhone: '正在读取...',
    userAlipayAccount: '正在读取...'
  },

  userPhoneClick: function(){
    var userPhone = this.data.userPhone;
    if (userPhone.length < 11){
      wx.navigateTo({
        url: 'bindPhone/bindPhone',
      })
    }else{
      app.gloadTipNoNext("暂未开放修改手机号功能！")
    }
  },

  queryInfo: function(){
    var that = this;
    wx.request({
      method: "post",
      header: {
        AuToken: app.globalData.token
      },
      url: app.globalData.serviceBase + '/user/service/queryInfo',
      success: function(res){
        app.validateToken(res);
        if(res.data.code == 200){
          that.setData({
            uid: res.data.data.id,
            userName: res.data.data.userName,
            userPhone: res.data.data.userPhone == null || res.data.data.userPhone == '' ? '未绑定' : res.data.data.userPhone,
            userAlipayAccount: res.data.data.userAlipayAccount
          })
        }else{
          app.gloadTipNoNext(res.data.msg);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //读取微信用户信息开始
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    //读取微信用户信息结束
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
    this.queryInfo();
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
  
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})