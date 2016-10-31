// // 定义自己的log
var log = function() {
    console.log.apply(console, arguments)
}
//
// 插入TODOlist区域
var todoList = function() {
    var todoContainer = `
    <div class="todo-main">
        <!-- todo 输入框 -->
        <div class="todo-form">
            <input id='id-input-todo' type="text">
            <button id='id-button-add' type="button">Add</button>
            <input id='id-input-todoID' type='text'>
            <button id='id-button-query' type='button'>Query</button>
        </div>
        <!-- todo 列表 -->
        <div id="id-div-container">
            <!-- <div class='todo-cell'>
                <button class='todo-done'>完成</button>
                <button class='todo-delete'>删除</button>
                <span contenteditable='true'>上课</span>
                <span>时间</span>
                <span>ID</span>
            </div> -->
        </div>
    </div>
    `
    $('body').append(todoContainer)
}
// todo-cell的模板
var templateTodo = function(todo) {
    /*   todo =
    "created_time": 1476083080,
    "id": 75,
    "task": "to have dinner"
    }*/
    var t = `
        <div class='todo-cell'>
            <button class='todo-done'>完成</button>
            <button class='todo-delete'>删除</button>
            <button class='todo-edit'>编辑</button>
            <span class='todo-label' contenteditable='false'>${todo.task}</span>
            <span>${todo.created_time}</span>
            <span>${todo.id}</span>
        </div>
    `
    return t
}
// 插入一个todo-cell
var insertTodo = function(todo) {
    log('insertTodo 开始！')
    var t = templateTodo(todo)
    log('要添加的代码：', t)
    // 添加到 container 中
    $('#id-div-container').append(t)
    log('添加结束')
}


// 使用阿贾克斯获取所有TODO task
var ajaxGetAll = function(){
    $.ajax({
        type: 'get',
        url: '/todo/all',
        success: function(r){
            log('r-->', r)
            var todo = JSON.parse(r)
            log('todo-->', todo)
            insertTodo(todo[0])
        }
    })
}

// 使用阿贾克斯post一个request
var ajaxPostReq = function(){
    var request = {
                url: '/todo/add',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({task: 'study', id: 1, created_time: 1234568}),
                success: function(r) {
                    console.log('ok',arguments)
                    console.log('r--->', r)
                    var todo = JSON.parse(r)
                    insertTodo(todo)
                },
                error: function() {
                    console.log('err',arguments)
                }
            }
    $.ajax(request)
}


// 给 query button 绑定添加 todo 事件
var bindEventQuery = function() {
    log('bind query button')
    $('#id-button-query').on('click', function(){
        log('click query')
        //先清空原有的todo-cell
        $('#id-div-container').empty()
        // 获得 输入的ID
        var todoID = $('#id-input-todoID').val()
        if(todoID == '' ) {
            log('查询全部')
            ajaxGetAll()
        }

        //else {
        //     log('todoID', todoID)
        //     todoGetTask(todoID)
        //     log('todoGetTask() ends.')
        //     var single = window.singleTask
        //     log('single task:', single)
        //     insertTodo(single)
        // }
    })
}

var __main = function(){
    todoList()
    bindEventQuery()
    ajaxPostReq()
}
