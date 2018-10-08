//index.js
const db = wx.cloud.database();
const cm = db.command;
const util=require("../../utils/util.js");

Page({
  data: {
    adInfoArray:null,
    newTravelInfos:null,
  },
  
  onLoad: function () {
    const self = this;

    //获取广告
    db.collection("AdInfo").limit(3).where({
      IsDel: 0,
    }).get({
      success: res => {
        console.log(res.data);
        self.setData({
          adInfoArray: res.data,
        });
      },
      fail: err => {
        console.log(err);
      },
    });

    // db.collection("User").where({IsDel:1,}).get({
    //   success:res=>{
    //     console.log("test doc");
    //     console.log(res.data);
    //   },
    //   fail:err=>{
    //     console.log(err);
    //   }
    // });

    //获取热门旅游圈
    wx.cloud.callFunction({
      name:"getTravelInfo",
      data:{count:5,startIndex:0,},
      success:res=>{
        console.log(res);
        const newTravelInfos=res.result.data;
        newTravelInfos.map(ti=>{
          ti.AddTime = util.formatTime(new Date(ti.AddTime),3);
          return ti;
        });
        self.setData({
          newTravelInfos:res.result.data,
        });
      },
      fail:err=>{
        console.log(err);
      },
    });

    // db.collection("TravelInfo").limit(5).get().then(res=>{
    //   let travelInfoArray=res.data;
    //   async.map
    //   travelInfoArray.map(ti => {
    //     db.collection("User").where({ _openid:ti._openid}).get().then(res=>{
    //       ti.User=res.data;
    //     });
    //     return ti;
    //   });
    //   console.log("newTravel")
    //   console.log(travelInfoArray);
    //   self.setData({
    //     newTravelInfos: travelInfoArray,
    //   });
    //   console.log("newTravel end")
    //   console.log(self.data.newTravelInfos);
    // });
    
  },

  onReady:function(){
    
  },


  showAdInfo(res) {

  },


})
