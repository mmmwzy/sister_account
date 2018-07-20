// pages/my/bindPhone/bindPhone.js
var interval = null //倒计时函数
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countdown: 60,
    codeButText: "获取验证码",
    codeButDis: "",
    userPhone: '',
    userPhoneT: '',
    codeId: '',
    phoneCode: ''
  },
  setUserPhone: function(e){
    this.setData({
      userPhone: e.detail.value
    })
  },
  setPhoneCode: function(e){
    this.setData({
      phoneCode: e.detail.value
    })
  },
  bindPhone: function(){
    wx.showLoading({
      title: '请稍等',
    })
    wx.request({
      method:　"post",
      url: app.globalData.serviceBase + '/user/service/bindPhone',
      header: {
        AuToken: app.globalData.token
      },
      data: {
        id: this.data.codeId,
        userphone: this.data.userPhoneT,
        phonecode: this.data.phoneCode,
      },
      success: function(res){
        wx.hideLoading();
        app.validateToken(res);
        if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '绑定成功！点击确定返回个人中心！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../my',
                })
              }
            }
          })
        } else {
          app.gloadTipNoNext(res.data.msg)
        }
      }
    })
  },
  getCode: function(e){
    var that = this;
    var countdown = that.data.countdown
    interval = setInterval(function () {
      countdown--;
      that.setData({
        codeButText: countdown + 's'
      })
      if (countdown <= 0) {
        clearInterval(interval)
        that.setData({
          codeButText: '获取验证码',
          countdown: 61,
          codeButDis: ""
        })
      }
    }, 1000)  
  },
  getVerificationCode() {
    this.getCode();
    var that = this
    that.setData({
      codeButDis: "none"
    })
    this.getPhoneCode();
  },

  getPhoneCode: function(){
    var that = this;
    wx.request({
      url: app.globalData.serviceBase + '/codePhone/service/sendCode?userPhone=' + this.data.userPhone,
      header: {
        AuToken: app.globalData.token
      },
      success: function(res){
        app.validateToken(res);
        if(res.data.code == 200){
          app.gloadTipNoNext("验证码已发送，请注意查收!");
          that.setData({
            userPhoneT: that.data.userPhone,
            codeId: res.data.data
          })
        }else{
          clearInterval(interval)
          that.setData({
            codeButText: '获取验证码',
            countdown: 61,
            codeButDis: ""
          })
          app.gloadTipNoNext(res.data.msg);
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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