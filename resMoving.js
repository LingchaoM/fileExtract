var fs = require("fs")
var path = require("path");  

var outPutMp3 = "output/mp3/";
var outPutPng = "output/png/";

var deleteFolder = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
// 递归创建目录 同步方法
function mkdirsSync(dirname) {
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname))) {
			fs.mkdirSync(dirname);
			return true;
		}
	}
}

deleteFolder('output');
mkdirsSync(outPutPng);
mkdirsSync(outPutMp3);

var readDir = function(path){
	fs.readdir(path,function(err,files){
		if(err)
		{
			console.log("err:"+ err	);
			return;
		}

		files.forEach( function(file){
			fs.stat(path+"/"+ file,function(err,stats){
				if(stats.isFile())
				{
					console.log(file)
					if(file.indexOf('png') != -1)
					{
						console.log("moving "+file);
						copyFile(path+"/"+file,outPutPng+"/"+file);
					}
					else if (file.indexOf('mp3')!=-1)
					{
						console.log("moving "+file);
						copyFile(path+"/"+file,outPutMp3+"/"+file);
					}
				}
				else{
					readDir(path+"/"+file);
				}
			})
		});
	});
}

copyFile = function(from,to){
	var readStream = fs.createReadStream(from);
	var writeStream = fs.createWriteStream(to);
	readStream.pipe(writeStream);
}

var pathUrl="raw-assets";
readDir(pathUrl	);