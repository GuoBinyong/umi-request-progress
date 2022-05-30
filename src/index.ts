/**
 * umi-request 的 进度 中间件
 * @remarks
 * umi-request 不支持上传 和 下载 的进度事件，通过 本中间件，可让 umi-request 支持 上传 与 下载的进度事件
 * 
 * @packageDocumentation
 */


import { OnionMiddleware } from 'umi-request';
import ajaxRequest from './ajaxRequest';

/**
 * 进度事件的回调函数
 */
export type ProgressHandler = (this: XMLHttpRequest, ev: ProgressEvent) => any


/**
 * 扩展
 * @public
 */
declare module 'umi-request' {

    /**
     * 扩展 umi-request 的请求选项 RequestOptionsInit
     * @public
     */
  export interface RequestOptionsInit {
    /**
     * 上传进度事件的回调函数
     */
    onReqProgress?: ProgressHandler | null;
    /**
     * 下载进度事件的回调函数
     */
    onResProgress?: ProgressHandler | null;
  }
}


/**
 * umi-request 的 进度 中间件
 * @remark 
 * 支持 上传进度 和 下载进度。此中间件是内核中间件事，注册时最好使用选项 `{ core: true }`。
 * 
 * @example
 * ```ts
 * import request from 'umi-request';
 * import progressMiddleware from 'umi-request-progress';
 * 
 * // 注册中间件
 * request.use(progressMiddleware, { core: true });
 * 
 * // 上传文件
 * request("/file/upload",{
 * ...otherOptions,
 * //上传进度事件的回调函数
 * onReqProgress:function( ev: ProgressEvent){
 *   console.log(ev)
 * },
 * //下载进度事件的回调函数
 * onResProgress:function( ev: ProgressEvent){
 *   console.log(ev)
 * },
 * });
 * ```
 * 
 */
const progressMiddleware: OnionMiddleware = async function (ctx, next) {
  const { url, options } = ctx.req;
  if (!(options.onReqProgress || options.onResProgress)) {
    await next();
    return;
  }
  options.__umiRequestCoreType__ = 'ajaxRequest';

  const response = await ajaxRequest(url, options);
  ctx.res = response;

  await next();
};

export default progressMiddleware;
