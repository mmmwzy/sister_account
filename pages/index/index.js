//index.js
//获取应用实例
const app = getApp()
var time = require('../../utils/util.js');
Page({
  data: {
    pageNo: 0,
    pageSize: 10,
    pageCount: 0,
    rowCount: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bookBalance: '0.00',
    billList: [],
    loadCount:0 //业务处理数量计数器
  },
  onShow: function(){
    this.setData({
      loadCount: 0
    })
    this.quertBook();
    this.queryBillList(0);
  },
  onPullDownRefresh: function(){
    this.setData({
      loadCount : 0
    })
    wx.stopPullDownRefresh()
    this.quertBook();
    this.queryBillList(0);
  },
  firstPage: function(){
    this.queryBillList(0);
  },
  nextPage: function () {
    if (this.data.pageNo == this.data.pageCount){
      wx.showModal({
        title: '提示',
        content: "已经是最后一页了",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
    }else{
      this.queryBillList(this.data.pageNo);
    }
    
  },
  lastPage: function () {
    if (this.data.pageNo < 2){
      wx.showModal({
        title: '提示',
        content: "已经是第一页了",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
    }else{
      this.queryBillList(this.data.pageNo - 2);
    }
    
  },
  endPage: function () {
    this.queryBillList(this.data.pageCount - 1);
  },
  queryBillList: function(currPage){
    var that = this;
    if (that.data.loadCount == 0){
      wx.showLoading({
        title: '数据加载中',
        mask: true
      }) 
    }
    wx.request({
      url: app.globalData.serviceBase + '/bill/service/findByPage?pageNo=' + (currPage + 1) + "&pageSize=" + this.data.pageSize,
      method: "post",
      header: {
        AuToken: app.globalData.token
      },
      data: {},
      success: function(res){
        app.validateToken(res);
        that.setData({
          loadCount: that.data.loadCount + 1
        })
        if (res.data.code == "200"){
          that.setData({
            pageNo: res.data.data.pageNo,
            pageSize: res.data.data.pageSize,
            rowCount: res.data.data.rowCount,
            pageCount: res.data.data.pageCount,
            billList: res.data.data.queryResult,
          })
        }
        if (that.data.loadCount == 2) {
          wx.hideLoading();
        }
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  quertBook: function(){
    var that = this;
    if (that.data.loadCount == 0) {
      wx.showLoading({
        title: '数据加载中',
        mask: true
      }) 
    }
    //取账本信息
    wx.request({
      method: 'post',
      url: app.globalData.serviceBase + '/book/service/queryById',
      data: {
        id: '20180711040102-bd637a01960945d78'
      },
      header: {
        AuToken: app.globalData.token
      },
      success: function (res) {
        that.setData({
          loadCount: that.data.loadCount + 1
        })
        app.validateToken(res);
        if (res.data.code == '200') {
          that.setData({
            bookBalance: app.toFix(res.data.data.bookBalance, 2)
          })
        }
        if(that.data.loadCount == 2){
          wx.hideLoading();
        }
      }
    });
  },
  onLoad: function () {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
    // this.quertBook();
    // this.queryBillList(0);
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  addTallyView: function(){
    wx.redirectTo({
      url: '../tally/tally'
    })
  }
})
