/*
    启动脚本todoList_server.js
    启动脚本app.get方法，用于指定不同的访问路径所对应的回调函数callback
    这叫做“路由”（routing）。
*/
var express = require('express')
var bodyParser = require('body-parser');


var app = express()
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// setup static files
app.use(express.static('static'))
app.use(express.static('node_modules'))

// // 将index.html 的内容发送到页面中，生成动态网页
// app.get('/', function(request, response){
//     var path = 'index.html'
//     sendHtml(path, response)
// })
// // 读取HTML文件内容并发送
// var sendHtml = function(path, response){
//     // 编码utf-8
//     var options = {
//          encoding: 'utf-8'
//     }
//     // 请求fs：file system 文件系统
//     // fs 是 node 中处理文件和目录的库
//     var fs = require('fs')
//     fs.readFile(path, options, function(err, data){
//         console.log('读取の内容是：', data)
//         response.send(data)
//     })
// }

// 直接访问public中的静态网页index.html
app.use(express.static(__dirname + '/public'))

var fs = require('fs')
var options = {
    encoding: 'utf-8'
}
var loadTodos = function() {
    var text = fs.readFileSync('todo.json', options)
    var data = JSON.parse(text)
    return data
}

var todoData = loadTodos()
/*
var todoData = {
                folders: {
                            'default': '0',
                            'JS': 1,
                },
                todos: {
                    '0': [
                            {
                                id: 1,
                                task: 'task',
                                time: 201505,
                                checked: 'Done'
                            },
                            {
                                id: 2,
                                task: 'study',
                                time: 12334,
                                checked: 'Done'
                            }
                    ]
                },
}
*/
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
var getTime = function() {
    var d = new Date()
    var month = 1 + d.getMonth()
    // 月份, 0-11
    var day = d.getDate()
    // 日期, 1-31
    var hours = d.getHours()
    // 小时, 0-23
    var minutes = d.getMinutes()
    // 分钟, 0-59
    var time = `${month} / ${day}  ${hours}:${minutes}`
    return time
}

//get当前todo list 的folderName 和Id
// var getFolderId = function() {
//     var folder = []
//     var folderButton = $('#id-button-folder')
//     var buttonName = folderButton.text()
//     var buttonId = folderButton.attr('data-folderid')
//     return buttonId
// }
// 往todos中添加新todo
var addTodo = function(todo) {
    // todo = { task: "study", folderId: folderId} 形式
    // todos empty or not
    var folderId = todo.folderId
    var currentTodos = todoData.todos[folderId]
    var len = currentTodos.length
    if(len > 0) {
        todo.id = currentTodos[len - 1].id + 1
    }else {
        todo.id = 1
    }
    todo.time = getTime()
    todo.checked = "Undone"
    currentTodos.push(todo)
}

// 通过id来查找到todo, 并返回其在Todos中的下标
var todoById = function(todo) {
    var index = -1
    var folderId = todo.folderId
    var todos = todoData.todos[folderId]
    for (var i = 0; i < todos.length; i++) {
        var t = todos[i]
        if(t.id == todo.id) {
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
    var index = todoById(todo)
    var folderId = todo.folderId
    if (index != -1) {
        var todoUpdate = todoData.todos[folderId][index]
        todoUpdate.task = todo.task
        todoUpdate.checked = todo.checked
        return '更新成功！'
    }else if (index === -1) {
        return '没有相关任务！'
    }
}
// 更新folders
var updateFolder = function(folderArray) {
    // update folders
    var folders = todoData.folders
    var folderName = folderArray[0]
    var folderId = folderArray[1]
    folders[folderName] = folderId
    console.log(folders)
    // add a new blank folder in todos
    var todos = todoData.todos
    todos[folderId] = []
    console.log(todoData)
}
// query all todos
app.get('/todo/all', function(request, response){
    var data = JSON.stringify(todoData)
    response.send(data)
})
// query all todos of the folder with folderId
app.post('/folder/get', function(request, response){
    console.log('获取特定folder内的todos')
    var folderId = request.body[0]
    console.log(folderId)
    var todos = todoData.todos[folderId]
    var data = JSON.stringify(todos)
    response.send(data)
})
// add todo
app.post('/todo/add', function(request, response){
    console.log('request.body-->', request.body)
    var todo = request.body
    addTodo(todo)
    saveTodos(todoData)
    response.send(JSON.stringify(todo))
})

// update todo
app.post('/todo/update', function(request, response){
    console.log('request.body-->', request.body)
    var todo = request.body
    console.log('todo-->', todo)
    console.log(updateTodo(todo))
    saveTodos(todoData)
    response.send(JSON.stringify(todoData))
})

// update folder
app.post('/folder/update', function(request, response){
    console.log('request.body-->', request.body)

    var folderArray = request.body
    console.log('folder-->', folderArray)
    updateFolder(folderArray)
    saveTodos(todoData)
    response.send(JSON.stringify(todoData))
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
// delete folder
app.post('/folder/delete', function(request, response){
    console.log('request.body-->', request.body)
    // 删除相应的folder
    var folderName = request.body[0]
    delete todoData.folders[folderName]
    // 删除相应的todos
    var folderId = Number(request.body[1])
    console.log('folderId-->', folderId)
    delete todoData.todos[folderId]
    saveTodos(todoData)
    // 将默认分类返回以显示
    response.send(JSON.stringify(todoData.todos['0']))
})

// 将jQuery库和todo_list.js todo.json文件引入, 如此才能在index.html中引用这两个文件
app.get('/todo_list.js', function (req, res) {
    console.log('__dirname-->', __dirname)
    res.sendFile( __dirname + "/" + "todo_list.js" );
})
// app.get('/node_modules/jquery/dist/jquery.min.js', function (req, res) {
//     console.log('__dirname-->', __dirname)
//     res.sendFile( __dirname + "/node_modules/jquery/dist/jquery.min.js" );
// })
app.get('/todo.json', function (req, res) {
    console.log('__dirname-->', __dirname)
    res.sendFile( __dirname + "/" + "todo.json" );
})
app.get('/todo.css', function (req, res) {
    console.log('__dirname-->', __dirname)
    res.sendFile( __dirname + "/" + "todo.css" );
})
app.get('/todo_folder.js', function (req, res) {
    console.log('__dirname-->', __dirname)
    res.sendFile( __dirname + "/" + "todo_folder.js" );
})


// 开启server，端口8081
var server = app.listen(8081, function(){

    var host = server.address().host
    var port = server.address().port

    console.log(`应用实例http://${host}:${port}`)
})
