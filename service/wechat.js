const UTILS = require('../utils')
const request = require('async-request')

// 小程序 获取微信用户的openid
const wechat = {
  _request: async function (opts) {
    try {
      let res = await request(opts.url, {
        method: opts.method || 'GET',
        data: opts.data || {}
      })
      console.log(JSON.parse(res.body))
      return JSON.parse(res.body)
    } catch (e) {
      throw new Error(`${new Date().toLocaleString()} => ${e}`)
    }
  },
  // 获取access token 缺少自刷新
  getAccessToken: async function (param) {
    let res = await this._request({
      url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${UTILS.appid}&secret=${UTILS.appsecret}`
    })
    return res.access_token
  },
  // 发送消息: 后面走接口，后台这边需要暴露接口页面
  sendMsg2User: async function (param) {
    let accessToken = await this.getAccessToken()
    // console.log(accessToken, param.openid)
    await this._request({
      url: `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`,
      method: 'POST',
      data: JSON.stringify({
        touser: param.openid,
        msgtype: 'text',
        text: {
          content: '您好，您在购物中遇到什么问题可添加客服微信进行咨询 wxid_x57k0d78fhkt12（小羊）, wyj15623101193（小民）'
        }
      })
    })
  },
  // 获取用户信息
  getUserOpenidFromWechat: async function (param) {
    let res = await this._request({
      url: `https://api.weixin.qq.com/sns/jscode2session?appid=${UTILS.appid}&secret=${UTILS.appsecret}&js_code=${param.code}&grant_type=authorization_code`
    })
    return res
  }
}
module.exports = wechat
