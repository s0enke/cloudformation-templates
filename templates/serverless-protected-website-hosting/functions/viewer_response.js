'use strict';

const util = require('util');

exports.handler = (event, context, callback) => {
    const response = event.Records[0].cf.response

    console.log('---------------------------------------------------------')
    console.log('---------------------------------------------------------')
    console.log(util.inspect(response, { showHidden: true, depth: null }))
    console.log('---------------------------------------------------------')

    response.headers['WWW-Authenticate'] = [{
        'key': 'WWW-Authenticate',
        'value': 'Basic'
    }]

    response.status = "401"
    response.statusDescription = "Unauthorized"

    response.body = "no no no"


    console.log(util.inspect(response, { showHidden: true, depth: null }))
    callback(null, response)
};