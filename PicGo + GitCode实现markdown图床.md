



##  1. 安装

- PicGo
- Picgo-plugin-gitcode插件

##  2. 建立图床库

![image-20250220133316492](https://luckly007.oss-cn-beijing.aliyuncs.com/nutpi/image-20250220133316492.png)

### 点击右上角的+号，新建仓库

1. 输入一个仓库名称
2. 其次将仓库设为公开
3. 勾选使用Readme文件初始化这个仓库
4. 点击下一步完成创建

![image-20250220133654658](https://luckly007.oss-cn-beijing.aliyuncs.com/nutpi/image-20250220133654658.png)

##  3. 配置PicGo

安装了**gitcode**插件之后，我们开始配置插件

### 配置插件的要点如下：

- repo：用户名/仓库名称，比如我自己的仓库qq_39132095/pic，找不到的可以直接复制仓库的url,复制浏览器的仓库地址，而不是页面左上角显示的，容易出现大小写问题
- token：填入码云的私人令牌
- path：路径，一般写上img
- customPath：提交消息，这一项和下一项customURL都不用填。在提交到码云后，会显示提交消息，插件默认提交的是 `Upload 图片名 by picGo - 时间`

###  这个token怎么获取，下面登录进自己的码云

![image-20250220133414618](https://luckly007.oss-cn-beijing.aliyuncs.com/nutpi/image-20250220133414618.png)

1. 点击头像，进入设置
2. 找到右边安全设置里面的私人令牌
3. 点击`生成新令牌`，把**projects**这一项勾上，其他的不用勾，然后提交
4. 这里需要验证一下密码，验证密码之后会出来一串数字，这一串数字就是你的token，将这串数字复制到刚才的配置里面去。



![image-20250220133542260](https://luckly007.oss-cn-beijing.aliyuncs.com/nutpi/image-20250220133542260.png)

1. > 注意：这个令牌只会明文显示一次，建议在配置插件的时候再来生成令牌，直接复制进去，搞丢了又要重新生成一个。

   

   

   ### 保存，完成即可。

![image-20250220133443679](https://luckly007.oss-cn-beijing.aliyuncs.com/nutpi/image-20250220133443679.png)



![image-20250221142531801](https://gitcode.com/qq_39132095/gitcodeimg/raw/master/img/image-20250221142531801.png)



_ixXD5z9uD-hCBPMHtT9F-vp