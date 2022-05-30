[API接口文档]: ./doc/index.md

[GitHub仓库]: https://github.com/GuoBinyong/umi-request-progress
[发行地址]: https://github.com/GuoBinyong/umi-request-progress/releases
[issues]: https://github.com/GuoBinyong/umi-request-progress/issues

[码云仓库]: https://gitee.com/guobinyong/umi-request-progress


[umi-request]: https://github.com/umijs/umi-request
[axios]: http://www.axios-js.com


> 目录

- [1. 背景](#1-背景)
- [2. 简介](#2-简介)
- [3. 安装方式](#3-安装方式)
  - [3.1. 方式1：通过 npm 安装](#31-方式1通过-npm-安装)
  - [3.2. 方式3：通过`<script>`标签引入](#32-方式3通过script标签引入)
- [4. 教程](#4-教程)
- [5. API接口文档](#5-api接口文档)



# 1. 背景
[umi-request][] 是基于 fetch 的，且有比 [axios] 更强的功能，唯一美中不足的是：umi-request 不支持进度事件，这在一些 上传 和 下载业务中是常见的需求，所以我就专门封装一个 umi-request 的内核中间件 `umi-request-progress`，专门用于解决进度的问题。 

# 2. 简介
umi-request-progress 是 网络请求库 umi-request 的一个内核中间件，扩展了 umi-request 使其支持 上传进度 和 下载进度。

**详情请看：**  
- 主页：<https://github.com/GuoBinyong/umi-request-progress>
- [GitHub仓库][]
- [码云仓库][]
- [教程][]
- [API接口文档][]


**如果您在使用的过程中遇到了问题，或者有好的建议和想法，您都可以通过以下方式联系我，期待与您的交流：**
- 给该仓库提交 [issues][]
- 给我 Pull requests
- 邮箱：<guobinyong@qq.com>
- QQ：guobinyong@qq.com
- 微信：keyanzhe





# 3. 安装方式
目前，安装方式有以下几种：


## 3.1. 方式1：通过 npm 安装
```
npm install umi-request-progress
```




## 3.2. 方式3：通过`<script>`标签引入
您可直接从项目的 [发行地址][] 中下载以 `.iife.js` 作为缀的文件，然后使用如下代码引用 和 使用 umi-request-progress：


1. 引用 umi-request-progress
   ```
   <script src="path/to/package/umi-request-progress.iife.js"></script>
   ```
   
2. 使用全局的 `UmiRequestProgress`
   ```
   <script>
   // 使用全局的 UmiRequestProgress
   </script>
   ```

# 4. 教程
`umi-request-progress` 给 `umi-request` 的请求选项 `RequestOptionsInit` 增加了以下两个选项
```ts
interface RequestOptionsInit {
    /**
     * 上传进度事件的回调函数
     */
    onReqProgress?: ProgressHandler | null;
    /**
     * 下载进度事件的回调函数
     */
    onResProgress?: ProgressHandler | null;
}
```

具体使用示例如下：
```ts
//导入 umi-request
import request from 'umi-request';
//导入 umi-request-progress
import progressMiddleware from 'umi-request-progress';

// 注册内核中间件
request.use(progressMiddleware, { core: true });

// 上传文件
request("/file/upload",{
   ...otherOptions,
   //上传进度事件的回调函数
   onReqProgress:function( ev: ProgressEvent){
     console.log(ev)
   },
   //下载进度事件的回调函数
   onResProgress:function( ev: ProgressEvent){
     console.log(ev)
   },
});
```


# 5. API接口文档
详情跳转至[API接口文档][]



--------------------

> 有您的支持，我会在开源的道路上，越走越远

![赞赏码](https://i.loli.net/2020/04/08/PGsAEqdJCin1oQL.jpg)