import EventEmitter from 'eventemitter3'
const EE = new EventEmitter()

function objectToQueryString (object) {
  return '?' +
    Object.keys(object).map(key =>
      `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`
    ).join('&')
}

function stringify (data) {
  return data && JSON.stringify(data)
}

function option (method = 'POST', data, headers) {
  const isObject = Object.prototype.toString.call(data) === '[object Object]'

  return {
    method,
    headers: headers || {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: isObject ? stringify(data) : data
  }
}

function checkStatus (response) {
  const { ok, status, statusText } = response
  if (
    ok &&
    (status >= 200 && status < 300) ||
    status === 304
  ) return response

  const error = new Error(statusText)
  error.response = response
  EE.emit('error', response, error, statusText)
  throw error
}

function parseJSON (response) {
  EE.emit('success', response, response.statusText)
  if (response.status === 204) return response
  return response.headers.get('Content-Type').indexOf('application/json') > -1
    ? response.json()
    : response.text()
}

function errorHandler (error) {
  const { response } = error
  if (
    response &&
    response.headers.get('Content-Type').indexOf('application/json') > -1
  ) {
    return response.json().then(err => { throw new Error(err.msg) })
  }
  throw error
}

function fetchData (method = 'POST', url, data, headers) {
  const fetchPromise = method === 'GET'
    ? fetch(url, { credentials: 'include' })
    : fetch(url, option(method, data, headers))

  return fetchPromise
    .then(checkStatus)
    .then(parseJSON)
    .catch(errorHandler)
}

export default {
  /**
   * 获取 json 对象
   * @param  {String} url 请求 URL
   * @return {Promise}    Promise 对象
   */
  get (url) {
    if (
      typeof url === 'object' &&
      typeof url.url === 'string' &&
      typeof url.query === 'object'
    ) {
      url = url.url + objectToQueryString(url.query)
    }
    return fetchData('GET', url)
  },
  post (url, data, headers) {
    return fetchData('POST', url, data, headers)
  },
  put (url, data) {
    return fetchData('PUT', url, data)
  },
  patch (url, data) {
    return fetchData('PATCH', url, data)
  },
  delete (url, data) {
    return fetchData('DELETE', url, data)
  },
  on (...args) {
    EE.on(...args)
  }
}
