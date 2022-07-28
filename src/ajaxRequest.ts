import { RequestOptionsInit} from 'umi-request';
/**
 * 使用 XMLHttpRequest 发送请求
 * @param url - 请求的 url
 * @param options - 请求的选项
 * @returns 响应内容的 Promise
 * @internal
 */
export default function ajaxRequest(url: string, options: {parseResponse:true} & Omit<RequestOptionsInit,"parseResponse">):Promise<string>;
export default function ajaxRequest(url: string, options: RequestOptionsInit):Promise<any>;
export default function ajaxRequest(url: string, options: RequestOptionsInit) {
  return new Promise(function (resolve, reject) {
    const method = options.method ?? 'get';
    const headers = options.headers ?? {};

    const {
      onReqProgress,
      onResProgress,
      credentials,
      responseType,
      body,
      parseResponse,
      timeout,
      cancelToken,
      signal
    } = options;

    const xhr = new XMLHttpRequest();

    // 时间超时
    if (timeout != null){
      xhr.timeout = timeout;
    }


    switch (credentials) {
      case 'include': {
        xhr.withCredentials = true;
        break;
      }
      case 'omit': {
        xhr.withCredentials = false;
        break;
      }
    }

    if (responseType !== 'formData') {
      xhr.responseType =
        (responseType?.toLowerCase() as XMLHttpRequestResponseType) ?? 'json';
    }

    xhr.open(method, url);


    // 处理 headers
    let headersEntries:string[][] = [];
    if (Array.isArray(headers)){
      headersEntries = headers;
    }else if (headers instanceof Headers){
      headers.forEach((value, key)=>{
        headersEntries.push([key,value])
      });
    }else {
      headersEntries = Object.entries(headers)
    }

    for (const [key, value] of headersEntries) {
      xhr.setRequestHeader(key, value);
    }


    if (cancelToken){
      cancelToken.promise.then(function(cancel){
        xhr.abort();
      });
    }

    if (signal){
      signal.addEventListener("abort",function(){
        xhr.abort();
      },{once:true})
    }


    xhr.onload = (e) =>
      resolve(parseResponse === false ? xhr.responseText : xhr.response);
    xhr.onerror = reject;
    if (xhr.upload && onReqProgress) {
      xhr.upload.onprogress = onReqProgress; //上传
    }

    if (onResProgress) {
      xhr.onprogress = onResProgress; //下载
    }

    xhr.send(body as XMLHttpRequestBodyInit);
  });
}
