var s3 = require('s3');
var gutil = require('gulp-util');


function CDNDeploy(config){
  var client = s3.createClient({
    s3Options: {
      accessKeyId: config.key,
      secretAccessKey: config.secret,
    },
  });

  var deploy = function(path, callback){
    var uploader = client.uploadDir({
      localDir: path,
      deleteRemoved: true,
      s3Params: {
        Bucket: config.bucket,
        ACL: "public-read"
      }
    });
    uploader.on('progress', function() {
      var percent = (uploader.progressAmount/uploader.progressTotal*100);
      gutil.log("aws:cdn", "progress: "+(percent || 0)+"%");
    });
    uploader.on('error', callback);
    uploader.on('end', callback);

    //todo invalidate CloudFront
  };

  return deploy;
}

module.exports = CDNDeploy;