const router = require('koa-router')()
const UTILS = require('../utils')
const indexDao = require('../dao/index')
// const _ = require('lodash')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: '你好'
  })
})

module.exports = router