// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const user = await db.collection("User").doc(event.id).get();
    const proviedLikeTime = await db.collection("TravelLike").where({IsDel:0,_openid:user.data._openid,}).count();
    const travelArray = await db.collection("TravelInfo").where({
      IsDel:0,
      _openid:user.data._openid,
    }).field({_id:true,}).get();
    let travelIdArray = [];
    for(let t=0;t<travelArray.data.length;t++){
      travelIdArray.push(travelArray.data[t]._id);
    }
    const gatherLikeTime = await db.collection("TravelLike").where({
      IsDel:0,
      TravelId:_.in(travelIdArray),
    }).count();
    const travelTime = travelIdArray.length;

    return {
      proviedLikeTime: proviedLikeTime.total,
      gatherLikeTime: gatherLikeTime.total,
      travelTime
    }
  }catch(e){
    console.error(e);
  }
}