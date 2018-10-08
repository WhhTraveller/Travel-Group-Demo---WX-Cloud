// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const travelInfoCount=await db.collection("TravelInfo").count();
    let travelInfoArray = await db.collection("TravelInfo").where({IsDel: 0,}).orderBy("AddTime","desc").skip(event.startIndex).limit(event.count).get();//等待获取得到TravelInfo后，再往下执行;
    for (let i = 0; i < travelInfoArray.data.length; i++) {
      const user = await db.collection("User").where({
        _openid: travelInfoArray.data[i]._openid,
        IsDel: 0,
      }).limit(1).get();//等待获取每个User后，再往下执行；
      travelInfoArray.data[i].User = user.data[0];

      const travelPic=await db.collection("TravelPic").where({
        IsDel:0,
        TravelId:travelInfoArray.data[i]._id
      }).get();//等待获取所有图片，再往下执行
      travelInfoArray.data[i].TravelPic=travelPic.data;

      let travelLikeArray = await db.collection("TravelLike").where({
        IsDel:0,
        TravelId:travelInfoArray.data[i]._id,
      }).get();//等待获取每个travelInfo下的点赞数据
        for(let j=0;j<travelLikeArray.data.length;j++){
          const userForLike=await db.collection("User").where({
            IsDel:0,
            _openid:travelLikeArray.data[j]._openid,
          }).get();
          travelLikeArray.data[j].AvatarUrl = userForLike.data[0].AvatarUrl;
        }
      
      travelInfoArray.data[i].TravelLikeArray = travelLikeArray.data;
    }

    const hasMore = travelInfoCount > (event.startIndex + travelInfoArray.data.length)?true:false;
    travelInfoArray.hasMore=hasMore;
    return travelInfoArray;
  } catch (e) {
    console.error(e);
  }
}