const path = require('path')
exports.handler = (evt, ctx, cb) => {
  const { request } = evt.Records[0].cf
  if (!path.extname(request.uri)) {
    console.log(request.uri)
    request.uri = request.uri + 'index.html'
    console.log(request.uri)
  }

  cb(null, request)
}
