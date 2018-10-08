// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
  const Summary = event.summary;
  return await db.collection("TravelInfo").add({
    data:{
      _openid:event.userInfo.openId,
      Summary,
      AddTime:new Date(),
      AccessTime:0,
      LikeTime:0,
      CommentTime:0,
      IsDel:0,
    },
  });
  }catch(err){
    console.log(err);
  }
}