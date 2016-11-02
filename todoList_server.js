var express = require('express')
var bodyParser = require('body-parser');


var app = express()
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// setup static files
app.use(express.static('static'))



app.get('/', function(request, response){
    var path = 'index.html'
    sendHtml(path, response)
})
// 读取HTML文件内容并发送
var sendHtml = function(path, response){
    // 编码utf-8
    var options = {
         encoding: 'utf-8'
    }
    // 请求fs：file system 文件系统
    // fs 是 node 中处理文件和目录的库
    var fs = require('fs')
    fs.readFile(path, options, function(err, data){
        console.log('读取の内容是：', data)
        response.send(data)
    })
}

var fs = require('fs')
var options = {
    encoding: 'utf-8'
}
var loadTodos = function() {
    var text = fs.readFileSync('todo.json', options)
    var data = JSON.parse(text)
    return data
}

var todos = loadTodos()
// [
//     {
//         "id": 1,
//         "task": "study",
//     },
//     {
//         id: 2,
//         task: 'go to school'
//     },
// ]

// save todo
var saveTodos = function(todos) {
    var data = JSON.stringify(todos)
    fs.writeFile('todo.json', data, options, function(e){
        if(e != null) {
            throw e
        }
        console.log('todo保存成功！')
    })
}

// 往todos中添加新todo
var addTodo = function(todo) {
    // todo = { task: "study"} 形式
    // todos empty or not
    var len = todos.length
    if(len > 0) {
        todo.id = todos[len - 1].id + 1
    }else {
        todo.id = 1
    }
    todos.push(todo)
}

// 通过id来查找到todo, 并返回其在Todos中的下标
var todoById = function(id) {
    var index = -1
    for (var i = 0; i < todos.length; i++) {
        var t = todos[i]
        if(t.id == id) {
            index = i
        }
    }
    return index
}

// 通过id来删除某个todo
var deleteTodo = function(id) {
    var index = todoById(id)
    if (index != -1) {
        todos.splice(index, 1)
        return '删除成功！'
    }else if (index === -1) {
        return '没有相关任务！'
    }
}

// 通过id来更新相对应的todo
var updateTodo = function(todo) {
    var index = todoById(todo.id)
    if (index != -1) {
        var todoUpdate = todos[index]
        todoUpdate.task = todo.task
        return '更新成功！'
    }else if (index === -1) {
        return '没有相关任务！'
    }
}

// query all todos
app.get('/todo/all', function(request, response){
    var data = JSON.stringify(todos)
    response.send(data)
})

// add todo
app.post('/todo/add', function(request, response){
    console.log('request.body-->', request.body)
    var todo = request.body
    addTodo(todo)
    saveTodos(todos)
    response.send(JSON.stringify(todo))
})

// update todo
app.post('/todo/update', function(request, response){
    console.log('request.body-->', request.body)
    var todo = request.body
    console.log('todo-->', todo)
    console.log(updateTodo(todo))
    saveTodos(todos)
    response.send(JSON.stringify(todos))
})

// delete todo
app.post('/todo/delete', function(request, response){
    console.log('request.body-->', request.body)
    var id = Number(request.body.id)
    console.log('id-->', id)
    console.log(deleteTodo(id))
    saveTodos(todos)
    response.send(JSON.stringify(todos))
})


// 将jQuery库和todo_list.js todo.json文件引入, 如此才能在index.html中引用这两个文件
app.get('/todo_list.js', function (req, res) {
    console.log('__dirname-->', __dirname)
    res.sendFile( __dirname + "/" + "todo_list.js" );
})
app.get('/node_modules/jquery/dist/jquery.min.js', function (req, res) {
    console.log('__dirname-->', __dirname)
    res.sendFile( __dirname + "/node_modules/jquery/dist/jquery.min.js" );
})
app.get('/todo.json', function (req, res) {
    console.log('__dirname-->', __dirname)
    res.sendFile( __dirname + "/" + "todo.json" );
})




// 开启server，端口8081
var server = app.listen(8081, function(){

    var host = server.address().host
    var port = server.address().port

    console.log(`应用实例http://${host}:${port}`)
})
