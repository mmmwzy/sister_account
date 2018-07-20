var dateTimePicker = require('../../utils/dateTimePicker.js');
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    value: null, // 上次计算后的结果，null表示没有上次计算的结果
    displayValue: '0', // 显示数值
    operator: null, // 上次计算符号，null表示没有未完成的计算
    waitingForOperand: false, // 前一按键是否为计算符号
    billType: '1', //收支类型
    billContextType: '1', //记账类型
    billDispatchType: '0', //是否需要报销
    billAmount: '', //账单金额
    billRemark: '', //账单备注
    billDescribe: '' // 账单描述
  },
  imgSave:function(){
    wx.showModal({
      title: '提示',
      content: "带图片提交功能暂未开放",
      showCancel: false,
      success: function (res) {
      }
    })
  },
  toZhang: function(){
    wx.switchTab({
      url: '/pages/index/index'　// 页面 A
    })
  },
  noImgSave: function(){
    var that = this
    wx.request({
      url: app.globalData.serviceBase + '/bill/service/create',
      method: 'post',
      data : {
        "billAmount": that.data.billAmount == '' ? '0.00' : that.data.billAmount,
        "billType": that.data.billType,
        "billContextType": that.data.billContextType,
        "billDispatchType": that.data.billDispatchType,
        "billRemark": that.data.billRemark,
        "billDataView": that.data.dateTimeArray1[0][that.data.dateTime1[0]] + "-" + that.data.dateTimeArray1[1][that.data.dateTime1[1]] + "-" + that.data.dateTimeArray1[2][that.data.dateTime1[2]] + " " + that.data.dateTimeArray1[3][that.data.dateTime1[3]] + ":" + that.data.dateTimeArray1[4][that.data.dateTime1[4]],
        "billDescribe": that.data.billDescribe,
      },
      header: {
        "Autoken": app.globalData.token
      },
      success: function(res){
        app.validateToken(res);
        if(res.data.code == '200'){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              wx.switchTab ({
                url: '/pages/index/index'　// 页面 A
              })
            }
          })
        }else{
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
  },
  //账单备注输入框监听
  billDescribeChange: function (e) {
    this.setData({
      billDescribe: e.detail.value
    })
  },
  //账单备注输入框监听
  billRemarkChange: function (e) {
    this.setData({
      billRemark: e.detail.value
    })
  },
  //账单金额输入框监听
  billAmountChange: function(e){
    this.setData({
      billAmount : app.toFix(e.detail.value, 2)
    })
  },
  //收支类型单选框监听
  billTypeRadioChange: function(e){
    this.setData({
      billType : e.detail.value
    })
  },
  //记账类型单选框监听
  billContextTypeRadioChange: function (e) {
    this.setData({
      billContextType : e.detail.value
    })
  },
  //是否需要报销单选框监听
  billDispatchTypeRadioChange: function (e) {
    this.setData({
      billDispatchType : e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //计算器功能处理开始
    this.calculatorOperations = {
      'key-divide': (prevValue, nextValue) => prevValue / nextValue,
      'key-multiply': (prevValue, nextValue) => prevValue * nextValue,
      'key-add': (prevValue, nextValue) => prevValue + nextValue,
      'key-subtract': (prevValue, nextValue) => prevValue - nextValue,
      'key-equals': (prevValue, nextValue) => nextValue
    }
    //计算器功能处理结束
    //获取时间开始
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
    //获取时间结束
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
        });
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
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  /* AC操作，一下回到解放前 */
  clearAll() {
    this.setData({
      value: null,
      displayValue: '0',
      operator: null,
      waitingForOperand: false
    })
  },

  /* 仅清空当前显示的输入值 */
  clearDisplay() {
    this.setData({
      displayValue: '0'
    })
  },

  onTapFunction: function (event) {
    const key = event.target.dataset.key;

    switch (key) {
      case 'key-clear':
        if (this.data.displayValue !== '0') {
          this.clearDisplay();
        } else {
          this.clearAll();
        }

        break;

      case 'key-sign':
        var newValue = parseFloat(this.data.displayValue) * -1

        this.setData({
          displayValue: String(newValue)
        })

        break;

      case 'key-percent':
        const fixedDigits = this.data.displayValue.replace(/^-?\d*\.?/, '')
        var newValue = parseFloat(this.data.displayValue) / 100

        this.setData({
          displayValue: String(newValue.toFixed(fixedDigits.length + 2))
        });

        break;

      default:
        break;
    }
  },

  onTapOperator: function (event) {
    const nextOperator = event.target.dataset.key;
    const inputValue = parseFloat(this.data.displayValue);

    if (this.data.value == null) {
      this.setData({
        value: inputValue
      });
    } else if (this.data.operator) {
      const currentValue = this.data.value || 0;
      const newValue = this.calculatorOperations[this.data.operator](currentValue, inputValue);

      this.setData({
        value: newValue,
        displayValue: String(newValue)
      });
    }

    this.setData({
      waitingForOperand: true,
      operator: nextOperator
    });
  },

  onTapDigit: function (event) {
    const key = event.target.dataset.key; // 根据data-key标记按键

    if (key == 'key-dot') {
      // 按下点号
      if (!(/\./).test(this.data.displayValue)) {
        this.setData({
          displayValue: this.data.displayValue + '.',
          waitingForOperand: false
        })
      }
    } else {
      // 按下数字键
      const digit = key[key.length - 1];

      if (this.data.waitingForOperand) {
        this.setData({
          displayValue: String(digit),
          waitingForOperand: false
        })
      } else {
        this.setData({
          displayValue: this.data.displayValue === '0' ? String(digit) : this.data.displayValue + digit
        })
      }
    }
  },
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        _this.setData({
          logo: res.tempFilePaths[0],
        })
      }
    })
  }
})
