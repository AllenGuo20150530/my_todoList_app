var express = require('express')
var app = express()

// use static files
app.use(express.static('static'))

app.get('/', function(request, response){
    // // 读取首页消息
    // var options = {
    //      encoding: 'utf-8'
    // }
    //
    // var fs = require('fs')
    // fs.readFile('index.html', options, function(err, data){
    //     console.log('读取の内容是：', data)
    //     response.send(data)
    // })
    var path = 'index.html'
    sendHtml(path, response)
})

var sendHtml = function(path, response){
    var options = {
         encoding: 'utf-8'
    }

    var fs = require('fs')
    fs.readFile(path, options, function(err, data){
        console.log('读取の内容是：', data)
        response.send(data)
    })
}


app.get('/todo/all', function(request, response){
    var all = [
        {
            'id': 1,
            'task': '喝水'
        }
    ]
    var data = JSON.stringify(all)
    response.send(data)
})

// 传入文件
// var sendDoc = fucntion(path, docName) {
//     app.get('/' + docName, function (req, res) {
//         console.log('__dirname-->', __dirname)
//         res.sendFile( __dirname + path + docName );
//     })
// }
//
// sendDoc('/', 'todo_list.js')

// 将jQuery库和todo_list.js文件引入
app.get('/todo_list.js', function (req, res) {
    console.log('__dirname-->', __dirname)
    res.sendFile( __dirname + "/" + "todo_list.js" );
})
app.get('/node_modules/jquery/dist/jquery.min.js', function (req, res) {
    console.log('__dirname-->', __dirname)
    res.sendFile( __dirname + "/node_modules/jquery/dist/jquery.min.js" );
})


var server = app.listen(8081, function(){
    var host = server.address().host
    var port = server.address().port

    console.log(`应用实例http://${host}:${port}`)
})
