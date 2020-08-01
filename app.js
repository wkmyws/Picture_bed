const Koa = require('koa');
const Router = require('koa-router')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const app = new Koa();
const router = new Router();
const config = require('./config')
const fs = require('fs')
const path = require('path')


//增加图片 后端
// post{file:,pwd:,}
router.post('/api/upload', async (ctx, next) => {
    if (config.uploadPwd && config.uploadPwd != ctx.request.body.pwd) {
        fs.unlinkSync(ctx.request.files.file.path)
        ctx.body = "口令错误"
    } else {
        ctx.body = config.address + "/" + ctx.request.files.file.path.split("/").pop()
    }
})
//增加图片 前端
router.get('/api/upload', async (ctx, next) => {
    let data = fs.readFileSync('./upload.html')
    ctx.type = "text/html"
    ctx.body = data
})

//删除图片 后端
// post{name:,pwd:,}
router.post('/api/del', (ctx, next) => {
    if (config.delPwd && config.delPwd != ctx.request.body.pwd) {
        ctx.body = "口令错误"
    } else {
        try {
            fs.unlinkSync(path.join(config.imgPath, ctx.request.body.name.split("/").pop()))
            ctx.body = "删除成功"
        } catch (err) {
            ctx.body = err.toString()
        }
    }
})

//删除图片 前端
router.get('/api/del', (ctx, next) => {
    let data = fs.readFileSync('./del.html')
    ctx.type = "text/html"
    ctx.body = data
})


app.use(cors({
    //跨域配置
    credentials: true,//默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器许可Cookie可以包含在请求中
    origin: ctx => ctx.header.origin, // web前端服务器地址，注意这里不能用*
}))
    .use(async (ctx, next) => {//处理错误
        try {
            await next()
            if (!ctx.body) {
                let data = fs.readFileSync('./index.html')
                ctx.type = "text/html"
                ctx.body = data
            }
        } catch (err) {
            ctx.body = err.toString()
        }
    })
    .use(koaBody({
        multipart: true,
        formidable: {
            uploadDir: config.imgPath,
            keepExtensions: true,
        }
    }))
    .use(require('koa-static')(path.join(__dirname, config.imgPath)))
    .use(router.routes())
    .listen(config.port)