var express = require('express')
var app = express()
var expressWs = require('express-ws')(app, null, {
  // ws options here
  perMessageDeflate: false,
})
const websocketStream = require('websocket-stream')
const fs = require('fs')

app.use(function (req, res, next) {
  console.log('middleware')
  req.testing = 'testing'
  return next()
})

app.get('/', function (req, res, next) {
  console.log('get route', req.testing)
  res.end()
})

app.ws('/', function (ws, req) {
  ws.on('message', function (msg) {
    console.log(msg)
  })
  console.log('socket', req.testing)
})

app.ws('/bigdata.json', function (ws, req) {
  // convert ws instance to stream
  const stream = websocketStream(ws, {
    // websocket-stream options here
    binary: true,
  })
  try {
    fs.createReadStream(
      '/Users/mingderwang/src/all/Templates/crl/socket-stream/bigdata.json',
    ).pipe(stream)
  } catch (e) {
    console.log('error', e)
  }
})

app.listen(3000)
