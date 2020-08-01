module.exports={
    port:24680, //绑定的端口号
    /*
     *返回图片地址的格式： address/imagePath
     *基于域名的:  域名/图片地址
     *基于ip+端口的:  ip:port/图片地址
    */
    address:"http://39.106.182.167:24680", 
    imgPath:"./img", //图片上传地址
    uploadPwd: null, //上传图片需要的密码，设为null则不需要密码
    delPwd: "del", //删除图片需要的密码，设为 null 则不需要密码
}