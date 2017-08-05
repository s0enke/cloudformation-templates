const path = require('path')
exports.handler = (evt, ctx, cb) => {
  const { request } = evt.Records[0].cf
  if (!path.extname(request.uri)) {
    // we assume a path and add index.html to the request iru, if there is no file extension
    const path_parts = path.parse(request.uri)
    const new_uri = path.join(path_parts.dir, path_parts.base, 'index.html')
    console.log('rewriting ' + request.uri + ' to ' + new_uri)
    request.uri = new_uri
  }
  
  cb(null, request)
}