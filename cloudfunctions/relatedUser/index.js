// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const openId = event.userInfo.openId;
    const checkUser = await db.collection("User").where({
      IsDel: 0,
      _openid: openId
    }).get();
    if (checkUser.data.length>0) {
      await db.collection("User").doc(checkUser.data[0]._id).update({
        data: {
          WeiXinName: event.user.nickName,
          AvatarUrl: event.user.avatarUrl,
          Summary: "",
        },
      }); //有可能用户信息更新了，需要重新获取并更新到数据库；
      return checkUser.data[0]._id;
    } else {
      const addUser = await db.collection("User").add({
        data: {
          _openid:event.userInfo.openId,
          WeiXinName: event.user.nickName,
          AvatarUrl: event.user.avatarUrl,
          IsDel: 0,
          Summary: "",
        },
      }); //生成用户信息到数据库；
      return addUser._id;
    }
  } catch (e) {
    console.error(e);
  }
}