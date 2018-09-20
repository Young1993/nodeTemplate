const request = require('async-request')
const UTILS = {
  //  解析xml
  getXMLNodeValue: function (node, xml) {
    try {
      let tmp = xml.split('<' + node + '>')
      let _tmp = tmp[1].split('</' + node + '>')
      return _tmp[0]
    } catch (err) {
      console.log(err)
      return '[error]'
    }
  },
  // 预支付接口
  prePay: async function (req) {
    let url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
    let formData = '<xml>'
    let prepayIdTmp, nonceStrTmp
    formData += '<appid>' + this.appid + '</appid>' // appid
    formData += '<body>' + req.body + '</body>' // 商品或支付单简要描述
    formData += '<device_info>' + req.device_info + '</device_info>' // 硬件信息
    formData += '<mch_id>' + this.mch_id + '</mch_id>' // 商户号
    formData += '<nonce_str>' + req.nonce_str + '</nonce_str>' // 随机字符串，不长于32位
    formData += '<notify_url>' + this.notifyUrl + '</notify_url>' // 支付成功后微信服务器通过POST请求通知这个地址
    formData += '<openid>' + req.openid + '</openid>'
    formData += '<out_trade_no>' + req.out_trade_no + '</out_trade_no>' // 订单号
    formData += '<spbill_create_ip>' + req.spbill_create_ip + '</spbill_create_ip>' //
    formData += '<total_fee>' + req.total_fee + '</total_fee>' // 金额
    formData += '<trade_type>' + req.trade_type + '</trade_type>' // NATIVE会返回code_url ，JSAPI不会返回
    formData += '<sign>' + req.sign + '</sign>'
    formData += '</xml>'
    // 请求微信
    try {
      let res = await request(url, {
        method: 'POST',
        data: formData // body
      })
      console.log('https://api.mch.weixin.qq.com/pay/unifiedorder => ', res)
      if (res.statusCode === 200) {
        // prepay_id
        let prepayId = this.getXMLNodeValue('prepay_id', res.body.toString('utf-8'))
        let tmp1 = prepayId.split('[')
        prepayIdTmp = tmp1[2].split(']')
        // nonce_str
        let nonceStr = this.getXMLNodeValue('nonce_str', res.body.toString('utf-8'))
        let tmp2 = nonceStr.split('[')
        nonceStrTmp = tmp2[2].split(']')
        return {
          prepay_id: prepayIdTmp[0],
          nonce_str: nonceStrTmp[0]
        }
      }
    } catch (e) {
      throw new Error(`pre pay fial ${UTILS.timeFormat()}:${e}`)
    }
  },
  raw: function (args) {
    let keys = Object.keys(args)
    keys = keys.sort()
    let newArgs = {}
    keys.forEach(function (key) {
      newArgs[key] = args[key]
    })

    let string = ''
    for (let k in newArgs) {
      string += '&' + k + '=' + newArgs[k]
    }
    string = string.substr(1)
    return string
  },
  // 支付签名
  paySign: async function (req) {
    let string = await this.raw(req)
    let key = this.app_key // 'app_key';
    string = string + '&key=' + key // key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
    let crypto = require('crypto')
    return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase()
  },
  // 随机数
  randomString: (length = 32) => {
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = chars.length
    let pwd = ''
    for (let i = 0; i < length; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  },
  // 时间格式转换
  timeFormat: (time = new Date(), type = 0) => {
    let t = new Date(time)
    let yy = t.getFullYear()
    let mm = t.getMonth() + 1
    let dd = t.getDate()
    let hh = t.getHours()
    let ss = t.getMinutes()
    let mmm = t.getSeconds()

    if (mm < 10) mm = '0' + mm
    if (dd < 10) dd = '0' + dd
    if (hh < 10) hh = '0' + hh
    if (ss < 10) ss = '0' + ss
    if (mmm < 10) mmm = '0' + mmm

    switch (type) {
      case 0:
        return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + ss + ':' + mmm
      case 1:
        return yy + '-' + mm + '-' + dd
      case 2:
        return yy + '/' + mm + '/' + dd
      case 3:
        return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + ss
      case 4:
        return yy + '.' + mm + '.' + dd
      case 5:
        return yy + mm + dd + ' ' + hh + ':' + ss + ':' + mmm
      case 6:
        return yy + mm + dd + ' 00:00:00'
    }
  },
  sleep: (time = 1) => {
    return new Promise((resolve, reject) => setTimeout(resolve, time * 1000))
  },
  // http 请求返回
  response: (obj) => {
    if (obj) {
      return {
        data: obj,
        msg: 'success',
        status: true
      }
    } else {
      return {
        data: null,
        msg: 'fail',
        status: false
      }
    }
  }
}

module.exports = UTILS
