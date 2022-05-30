import { RequestOptionsInit } from 'umi-request';

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
    } = options;

    const xhr = new XMLHttpRequest();

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

    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
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