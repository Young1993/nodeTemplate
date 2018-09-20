const _DB = require('../config/db')
const DB = new _DB()
const $sql = require('../map/index')

module.exports = {
  // 获取资讯列表
  getArticleList: (req) => {
    // console.log(req)
    return DB._querySql($sql.getArticleList, [(req.currentPage - 1) * req.pageSize, req.currentPage * req.pageSize])
  },
}
