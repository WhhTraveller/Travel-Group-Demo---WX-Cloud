// pages/travelList/travelList.js
const app = getApp();
const util = require("../../utils/util.js");
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.globalData.systemInfo.windowWidth,
    windowHeight: app.globalData.systemInfo.windowHeight,
    travelInfoArray: [],
    count: 10,
    index: 0,
    hasMore: true,
    lowerText:"正在加载...",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    self.getTravelInfoArray(this.data.count, this.data.index);
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

  //下拉scroll-view刷新
  scrollToLower: function(e) {
    const self=this;
    if(self.data.hasMore){
      self.getTravelInfoArray(self.data.count, self.data.index);
    }
  },

  //获取travelInfoArray
  getTravelInfoArray:function(count,index){
    const self = this;
    wx.cloud.callFunction({
      name: "getTravelInfo",
      data: {
        count: self.data.count,
        startIndex: self.data.index,
      },
      success: res => {
        console.log(res);
        const travelInfoArray = res.result.data;
        const hasMore = res.result.hasMore;
        if (travelInfoArray.length > 0) {
          travelInfoArray.map(ti => {
            ti.AddTime = util.formatTime(new Date(ti.AddTime), 3);
            return ti;
          });
          self.setData({
            travelInfoArray: self.data.travelInfoArray.concat(travelInfoArray),
            index: index + travelInfoArray.length,
            hasMore,
            lowerText:hasMore?"正在加载...":"没有更多..",
          });
        }
      },
      fail: err => {
        console.error(err);
      }
    })
  }
})