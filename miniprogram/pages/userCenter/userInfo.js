// pages/userCenter/userInfo.js
const util = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    proviedLikeTime: 0,
    gatherLikeTime: 0,
    travelTime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          console.log(res.authSetting);
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo);
              self.setData({
                userInfo: res.userInfo,
              });
              self.relatedUser();
            },
          });
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //点击获取用户信息
  getUserInfo: function(e) {
    const self = this;
    self.setData({
      userInfo: e.detail.userInfo,
    });
    self.relatedUser();
  },

  //关联后端用户信息
  relatedUser: function() {
    console.log("relatedUser");
    const self = this;
    wx.cloud.callFunction({
      name: "relatedUser",
      data: {
        user: self.data.userInfo,
      },
      success: res => {
        console.log(res);
        self.getOtherInfo(res.result);
      },
    });
  },

  //获取用户其它信息
  getOtherInfo: function(id) {
    const self = this;
    wx.cloud.callFunction({
      name: "getUserOtherInfo",
      data: {
        id,
      },
      success: res => {
        console.log(res);
        self.setData({
          gatherLikeTime: res.result.gatherLikeTime,
          proviedLikeTime: res.result.proviedLikeTime,
          travelTime: res.result.travelTime,
        });
      },
      fail: err => {
        console.log(err)
      }
    });
  },

  //发布旅游圈
  publishTravel: function(e) {
    wx.chooseImage({
      count: 6,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '图片上传中',
        });
        console.log("循环开始");
        const tempFilePaths = res.tempFilePaths;
        let picArray = [];
        const promise = new Promise((resolve,reject)=>{
          let promiseArray = [];
          for (let i = 0; i < tempFilePaths.length; i++) {
            // (function (i) {
            const cloudPath = util.formatTime(new Date(), 4) + i.toString() + util.getFileExtention(tempFilePaths[i]);
            console.group("for start");
            console.log(`filePath:${tempFilePaths[i]}`);
            console.log(`cloud:${cloudPath}`);

            const promiseUpload = wx.cloud.uploadFile({
              filePath: tempFilePaths[i],
              cloudPath,
              // success: res => {
              //   picArray.push(res.fileID);
              //   console.log("上传成功" + i.toString());
              // },
              // fail: err => {
              //   console.log(err);
              // },
            });
            promiseArray.push(promiseUpload);
            console.groupEnd();
            // })(i)
          }
          Promise.all(promiseArray).then(res=>{
            resolve(res)
          })
        });
        promise.then(res=>{
          for(let i=0;i<res.length;i++){
            picArray.push(res[i].fileID);
          }
          app.globalData.picArray=picArray;
          wx.hideLoading();
          wx.navigateTo({
            url: './publishTravel/publishTravel',
          });
        }).catch(err=>{
          console.log(err);
        });
      },
    })
  },


})