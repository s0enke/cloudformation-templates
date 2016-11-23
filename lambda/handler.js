var childProcess = require('child_process');
var fs = require('fs');
var AWS = require('aws-sdk');
var codepipeline = new AWS.CodePipeline();
var s3;

// for NPM, it needs a writable home directory
process.env.HOME = '/tmp';

process.on('unhandledRejection', function(error, promise) {
  console.error("UNHANDLED REJECTION", error.stack);
});

exports.deployFrontendAction = function(event, context) {
    doAction(deployFrontendAction, event, context);
}

  // run an action
function doAction(actionFunction, event, context) {

    // init s3 here as we have the event object
    var job = event['CodePipeline.job'];
    s3 = new AWS.S3({
      "signatureVersion":"v4",
      "accessKeyId": job.data.artifactCredentials.accessKeyId,
      "secretAccessKey": job.data.artifactCredentials.secretAccessKey,
      "sessionToken": job.data.artifactCredentials.sessionToken
    });


    var promise;
    try {
        promise = actionFunction(event["CodePipeline.job"])
    } catch (e) {
        promise = Promise.reject(e);
    }

    handlePromise(promise, event, context);
}

// handle promise by notifying code pipeline
function handlePromise(promise, event, context) {
    promise
    .then(function() {
        console.log("Success!");

        var params = {
            jobId: event["CodePipeline.job"].id
        };
        codepipeline.putJobSuccessResult(params, function(err, data) {
            if(err) {
                context.fail(err);
            } else {
                context.succeed("Action complete.");
            }
        });
    }).catch( function(message) {
            var m = JSON.stringify(message);
            console.error("Failure: "+m);
            
            var params = {
                jobId: event["CodePipeline.job"].id,
                failureDetails: {
                    message: m,
                    type: 'JobFailed',
                    externalExecutionId: context.invokeid
                }
            };

            codepipeline.putJobFailureResult(params, function(err, data) {
                context.fail(m);
            });
    });
}


// return: promise
function deployFrontendAction(jobDetails) {
    var artifactName = 'SourceOutput';
    var artifactZipPath = '/tmp/source.zip';    
    var artifactExtractPath = '/tmp/source/';
    var sourceFrontendPath = artifactExtractPath + 'frontend/'
    var sourceFrontendBuildPath = sourceFrontendPath + 'build/'
    return downloadInputArtifact(jobDetails, artifactName, artifactZipPath)
        .then(function () {
            return rmdir(artifactExtractPath);
        }).then(function () {
            return extractZip(artifactZipPath, artifactExtractPath);
        }).then(function () {
            return npmInstallAndBuild(sourceFrontendPath);
        }).then(function () {
            return downloadInputArtifact(jobDetails, 'DeployInfrastructureStackOutput', '/tmp/DeployInfrastructureStackOutput.zip')
        }).then(function () {
            return uploadBuildToWebsiteBucket(sourceFrontendBuildPath);
        });
}

// get input artifact
//
// return: promise
function downloadInputArtifact(jobDetails, artifactName, dest) {
    console.log("Downloading input artifact '" + artifactName + "' to '"+dest+"'");

    // Get the input artifact
    var artifact = null;
    jobDetails.data.inputArtifacts.forEach(function (a) {
        
        if (a.name == artifactName) {
            artifact = a;
        }
    });

    if (artifact != null && artifact.location.type == 'S3') {
        var params = {
            Bucket: artifact.location.s3Location.bucketName,
            Key: artifact.location.s3Location.objectKey
        };
        return getS3Object(params, dest);
    } else {
        return Promise.reject("Unknown Source Type:" + JSON.stringify(sourceOutput));
    }
}

 
function getS3Object(params, dest) {
    return new Promise(function(resolve,reject) {
        console.log("Getting S3 Object '" + params.Bucket+"/"+params.Key + "' to '"+dest+"'");
        var file = fs.createWriteStream(dest);
        s3.getObject(params)
            .createReadStream()
            .on('error', reject)
            .pipe(file)
            .on('close', resolve);
    });
}

function exec(command,options) {
    return new Promise(function (resolve, reject) {
        var child = childProcess.exec(command,options);

        var lastMessage = ""
        child.stdout.on('data', function(data) {
            lastMessage = data.toString('utf-8');
            process.stdout.write(data);
        });
        child.stderr.on('data', function(data) {
            lastMessage = data.toString('utf-8');
            process.stderr.write(data);
        });
        child.on('close', function (code) {
            if(!code) {
                resolve(true);
            } else {
                reject("Error("+code+") - "+lastMessage);
            }
        });
    });
}

function rmdir(dir) {
    if(!dir || dir == '/') {
        throw new Error('Invalid directory '+dir);
    }

    console.log("Cleaning directory '"+dir+"'");
    return exec('rm -rf '+dir);
}


function extractZip(sourceZip,destDirectory) {
    return new Promise(function (resolve, reject) {
        console.log("Extracting zip: '"+sourceZip+"' to '"+destDirectory+"'");
        try {
            fs.mkdirSync(destDirectory);
            process.chdir(destDirectory);
            childProcess.execSync('unzip -o ' + sourceZip, {encoding: 'utf-8'});
            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
}

function npmInstallAndBuild(destDirectory) {
    return new Promise(function (resolve, reject) {
        try {
            process.chdir(destDirectory);
            childProcess.execSync('npm install --progress=false ', {encoding: 'utf-8'});
            childProcess.execSync('npm run build', {encoding: 'utf-8'});
            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
}

function uploadBuildToWebsiteBucket(destDirectory) {
    return new Promise(function (resolve, reject) {
        try {
            process.chdir('/tmp');
            childProcess.execSync('unzip -o /tmp/DeployInfrastructureStackOutput.zip');
            config = JSON.parse(fs.readFileSync('/tmp/cfn.json'));
            s3WebsiteBucketClient = new AWS.S3();

            process.chdir(destDirectory);
            var files = walkSync(destDirectory);
            files.forEach(function(file) {
                contentType = contentTypeMap(file)
                relativeFilePath = file.replace(destDirectory, '');
                s3WebsiteBucketClient.putObject({
                    'Bucket': config['WebsiteBucket'],
                    'Key': relativeFilePath,
                    'Body': fs.createReadStream(file),
                    'ContentType': contentType
                }, function(err, data) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log('Success');
                      }
                });
              });

            
            resolve(true);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

function walkSync(dir, filelist) {
  var path = path || require('path');
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};


function contentTypeMap(filename) {
     var map = {
         'jpg':  'image/jpeg',
         'png':  'image/png',
         'svg':  'image/svg+xml',
         'html': 'text/html',
         'css':  'text/css',
         'json': 'text/json',
         'ico':  'image/x-icon'
     };
     
     extension = filename.split('.').pop();
     if (extension in map) {
         return map[extension];
     } else {
         return 'application/octet-stream';
     }

}