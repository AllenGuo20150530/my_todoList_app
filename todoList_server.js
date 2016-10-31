var express = require('express')
var app = express()

var bodyParser = require('body-parser');
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// use static files
app.use(express.static('static'))

app.post('/todo/add', function(request, response){
    console.log('request.body-->', request.body)
    var data = {
        'id': request.body.id,
        'task': request.body.task,
        'created_time': request.body.created_time,
    }
    console.log(request.body.id, request.body.task)
    var r = JSON.stringify(data)
    response.send(r)
})
// app.post('/todo/add', function(request, response){
//     console.log('request.body-->', request.body)
//     response.send("post request")
// })

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
            "created_time": 1476083080,
            "id": 75,
            "task": "to have dinner"
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
