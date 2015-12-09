

var fs = require('fs');
var connect = require('connect');
var url = require('url');
var proxy = require('proxy-middleware');
var program = require('commander');
var hostile = require('hostile');

program
  .version('1.0.1')
  .option('-t, --target [value]', 'target server [http://127.0.0.1:8080] ')
  .option('-p, --port <n>', 'listen port [80]')
  .option('-h, --host [value]', 'bind domain to hosts file [wwww.google.com]')
  .option('-d, --dir [value]', 'origin virtual directory [/dir1/....]')
  .parse(process.argv);


var target = program.target;
var port = program.port || 80;
var host = program.host;
var dir = program.dir || '/';

if(!host && !target){
  return;
}

hostile.set('127.0.0.1', host);
console.log('set hosts successfully!');


process.on('exit', function(code) {
  hostile.remove('127.0.0.1',host);
  console.log('remove hosts successfully!');
});

process.on('SIGINT', function() {
  process.exit();
});
process.on('SIGTERM', function() {
  process.exit();
});

var app = connect();
app.use(dir, proxy(url.parse(target)));

app.listen(port);


console.log('listen port:' + port);