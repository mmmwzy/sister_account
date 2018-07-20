// pages/login/reg/reg.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code : '',
    userName: '',
    alipay: ''
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
  
  },

  listenerUserName: function(e){
    this.setData({
      userName: e.detail.value
    })
  },

  listenerAlipay: function (e) {
    this.setData({
      alipay: e.detail.value
    })
  },

  reg: function(){
    var that = this;
    wx.login({
      success: function(res){
        if (res.code) {
          that.setData({
            code: res.code
          })
          wx.request({
            url: app.globalData.serviceBase + '/user/reg',
            data: {
              code: that.data.code,
              userName: that.data.userName,
              alipay: that.data.alipay
            },
            success: function (res) {
              if (res.data.code == "5102") {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg + '点击确定将跳转登陆页面！',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/pages/login/login'　// 页面 A
                      })
                    }
                  }
                })
              } else if (res.data.code == "200") {
                wx.showToast({
                  title: res.data.msg ,
                  icon: 'success',
                  duration: 2000,
                  success: function (res) {
                    setTimeout(function () {
                      //要延时执行的代码
                      wx.redirectTo({
                        url: '/pages/login/login'　// 页面 A
                      })
                    }, 4000) //延迟时间
                    
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
    
  }
})