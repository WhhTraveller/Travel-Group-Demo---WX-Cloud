// pages/userCenter/publishTravel/publishTravel.js
const app=getApp();
const util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.systemInfo.windowWidth,
    picArray:[],
    picCount:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    self.setData({
      picArray: app.globalData.picArray,
      picCount: app.globalData.picArray.length,
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
  
  },

  // 上传图片
  publishImage: function(e){
    const self = this;
    wx.chooseImage({
      count: 6 - self.data.picCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths;
        let promiseUploadArray = [];
        for( let i=0;i<tempFilePaths.length;i++){
          const cloudPath = util.formatTime(new Date(), 4) + i.toString() + util.getFileExtention(tempFilePaths[i]);
          const promiseUpload = wx.cloud.uploadFile({
            filePath:tempFilePaths[i],
            cloudPath,
          });
          promiseUploadArray.push(promiseUpload);
        }
        // 合并执行，都执行结束后，再回调
        Promise.all(promiseUploadArray).then(res=>{
          const picArray = [];
          for(let i = 0; i < res.length;i++){
            picArray.push(res[i].fileID);
          }
          self.setData({
            picArray: self.data.picArray.concat(picArray),
            picCount: self.data.picCount + res.length,
          });
        });
      },
    })
  },

  // 提交表彰
  formSubmit: function(e){
    console.log(e);
    const self = this;
    wx.showLoading({
      title: '正在提交...',
    });
    wx.cloud.callFunction({
      name:"submitTravel",
      data:{
        summary:e.detail.value.summary,
      },
      success:res=>{
        console.log(res);
        wx.cloud.callFunction({
          name:"submitPics",
          data:{
            travelId:res.result._id,
            picArray:self.data.picArray,
          },
          success:res=>{
            console.log(res);
            wx.switchTab({
              url: '../../travelList/travelList',
            });
            wx.hideLoading();
          }
        });
      },
      fail:err=>{
        console.log(err);
      },
    });
  }
})