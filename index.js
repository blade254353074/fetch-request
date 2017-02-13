import queryString from 'query-string'
import EventEmitter from 'eventemitter3'

const MIME_TYPES = {
  json: 'application/json',
  urlencoded: 'application/x-www-form-urlencoded'
}

const EventEmitterInstance = new EventEmitter()

const defaultConfig = {
  timeout: null
}
const defaultOptions = {
  headers: {
    'Accept': MIME_TYPES.json,
    'Content-Type': MIME_TYPES.json
  },
  credentials: 'same-origin'
}

function request (method = 'GET', url, options) {
  options = Object.assign(defaultOptions, options)
  const {
    headers: { 'Content-Type': contentType },
    data
  } = options
  let requestBody

  if (contentType === MIME_TYPES.urlencoded) {
    requestBody = queryString.stringify(data, { arrayFormat: 'bracket' })
  } else if (contentType === MIME_TYPES.json) {
    requestBody = JSON.stringify(data)
  } else {
    requestBody = data
  }
  const fetchPromise = method === 'GET'
    ? fetch(url, options)
    : fetch(url, option(method, data, headers))

  return fetchPromise
    .then(checkStatus)
    .then(parseJSON)
    .catch(errorHandler)
}

export default {
  /**
   * 获取 json 对象
   * @param  {String} url     request url
   * @param  {Object} options request options (headers, credentials, data)
   * @return {Promise}        Promise 对象
   */
  get (url, options) {
    return request('GET', url, options)
  },
  post (url, options) {
    return request('POST', url, options)
  },
  put (url, options) {
    return request('PUT', url, options)
  },
  patch (url, options) {
    return request('PATCH', url, options)
  },
  delete (url, options) {
    return request('DELETE', url, options)
  },
  config: defaultConfig,
  options: defaultOptions,
  on (...args) {
    EventEmitterInstance.on(...args)
  }
}
