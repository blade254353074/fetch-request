<p align="center"><h1>fetch-request</h1></p>

Further encapsulation for fetch

## Document

```js
request.get('http://example.com/api')
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    reportError(err)
    console.error(err.message)
  })

request.get('http://example.com/api', {
  credentials: 'include',
  data: { a: 'b' }
})

request.post('http://example.com/api', {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  data: { a: 'b' }
})

Promise.all([
  request.get('http://example.com/api/foo'),
  request.post('http://example.com/api/bar', {
    data: { a: 'b' }
  })
])
  .then([res1, res2]) => {
    console.dir(res1, res2)
  })
  .catch(err => console.error(err))

request.on('error', err => {
  console.error(err)
})
```

## License

[MIT](https://github.com/blade254353074/fetch-request/blob/master/LICENSE)
