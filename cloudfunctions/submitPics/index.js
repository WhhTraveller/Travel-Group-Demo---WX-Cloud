// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    picArray = event.picArray;
    travelId = event.travelId;
    let promiseAddPicArray = [];
    for (let i = 0; i < picArray.length; i++) {
      const promiseAddPic = db.collection("TravelPic").add({
        data: {
          _openid:event.userInfo.openId,
          TravelId: travelId,
          PicSrc: picArray[i],
          IsDel: 0,
        },
      });
      promiseAddPicArray.push(promiseAddPic);
    }
    return await Promise.all(promiseAddPicArray);
  }catch(err){
    console.log(err);
  }
}