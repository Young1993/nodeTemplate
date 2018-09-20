// 顶级数据库 配置类
const mysql = require('mysql2/promise')
const Raven = require('raven')

class Db {
  constructor (opts) {
    let _opts = opts || {
      host: '',
      user: '',
      password: '',
      database: '',
      charset: 'utf8mb4'
    } // 默认佛教数据库

    this.conf = {
      host: _opts.host,
      user: _opts.user,
      password: _opts.password,
      database: _opts.database,
      charset: _opts.charset,
      port: '3306',
      connectionLimit: 50
    }

    this.pool = mysql.createPool(this.conf)
  }
  // 查询函数
  async _querySql (sql, options) {
    try {
      let results = await this.pool.query(sql, options)

      // console.log('query sql result:', results[0])

      if (results[0]) return results[0]
      else return results
    } catch (err) {
      console.error(`${new Date().toLocaleString()} ${sql} => ${err}`) // 记录错误
      return false
    }
  }
}

module.exports = Db
