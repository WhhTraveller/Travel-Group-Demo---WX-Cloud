//app.js
App({
  
  onLaunch: function () {
    const self=this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:"demo-clound-weapp-3532ea",
        traceUser: true,
      })
    }

    wx.getSystemInfo({
        success: function (res) { 
          self.globalData.systemInfo=res;
        },
      });
  },
  globalData: {
    systemInfo: null,
    picArray:[],
  },
  
})
