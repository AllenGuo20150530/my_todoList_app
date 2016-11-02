// // 定义自己的log
var log = function() {
    console.log.apply(console, arguments)
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
            <span>${todo.id}</span>
            <span class='todo-label' contenteditable='false'>${todo.task}</span>
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
            var todos = JSON.parse(r)
            log('todos-->', todos)
            for (var i = 0; i < todos.length; i++) {
                var todo = todos[i]
                insertTodo(todo)
            }
        }
    })
}

// 使用阿贾克斯post一个request, 添加todo
var ajaxAddTodo = function(todo){
    var request = {
                url: '/todo/add',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(todo),
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

// delete todo
var ajaxDeleteTodo = function(todoId){
    var request = {
                url: '/todo/delete',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({id: todoId}),
                success: function(r) {
                    console.log('ok',arguments)
                    console.log('r--->', r)
                    var todo = JSON.parse(r)
                    // insertTodo(todo)
                },
                error: function() {
                    console.log('err',arguments)
                }
            }
    $.ajax(request)
}

// update todo
var ajaxUpdateTodo = function(todo){
    var request = {
                url: '/todo/update',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(todo),
                success: function(r) {
                    console.log('ok',arguments)
                    console.log('r--->', r)
                    var todo = JSON.parse(r)
                    // insertTodo(todo)
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
        ajaxGetAll()

    })
}
// 给 Add button 绑定添加 todo 事件
var bindEventAdd = function() {
    $('#id-button-add').on('click', function(){
        log('click add')
        // 获得 输入的task
        var task = $('#id-input-todo').val()
        // log('task-->', task)
        var todo = {'task': task}
        // log('todo-->', todo)
        ajaxAddTodo(todo)
    })
}

// // 给删除按钮添加删除事件
// var bindEventDelete = function() {
//     $('#id-div-container').on('click', '.todo-delete', function(event){
//         log(event.target)
//         var target = $(event.target)
//         var parent = target.parent()
//         log(parent)
//         var id = $(parent.children()[3]).text()
//         var todoId = Number(id)
//         log(typeof todoId)
//         ajaxDeleteTodo(todoId)
//         // 移除删除的task cell
//         parent.remove()
//     })
// }

// 点击 task cell 上的按钮时按钮时使事件加一条删除线
var bindEventCell = function() {
    $('.todo-cell').on('click', function(event){
        var target = $(event.target)
        log(target)
        var parent = target.parent()
        //点击 编辑 按钮时使task span标签获得焦点
        if(target.hasClass('todo-edit')) {
            var todoSpan = $(parent.children()[4])
            todoSpan.attr('contenteditable', true)
            todoSpan.focus()
        }else if (target.hasClass('todo-done')) {
            // 点击 完成 按钮时使事件加一条删除线
            parent.addClass('todo-complete')
        }else if (target.hasClass('todo-delete')) {
            // 给删除按钮添加删除事件
            var id = $(parent.children()[3]).text()
            var todoId = Number(id)
            log(typeof todoId)
            ajaxDeleteTodo(todoId)
            // 移除删除的task cell
            parent.remove()
        }
    })
}

// 所有的点击button的事件
var bindEventButtons = function() {
    bindEventQuery()
    bindEventAdd()
    bindEventCell()
}
// // 绑定编辑按钮，回车时更新
// var bindEventEnter = function() {
//     var todoContainer = document.querySelector('#id-div-container')
//     todoContainer.addEventListener('keydown', function(event){
//         log('container keydown', event, event.target)
//         var target = event.target
//         if(event.key === 'Enter') {
//             log('按了回车')
//             // 失去焦点
//             target.blur()
//             // 阻止默认行为的发生, 也就是不插入回车
//             event.preventDefault()
//             var todo_cell = target.parentElement
//             log('当前元素--->', todo_cell)
//             var task_id = todo_cell.children[5].innerHTML
//             log('更改任务的ID--->', task_id)
//             // var index = indexOfElement(todo_cell)
//             // log('update index',  index)
//             // 把元素在 todoList 中更新
//             var task_update = {"task": target.innerHTML}
//             log('更改后任务--->', task_update)
//             // todoList.splice(index, 1)
//             //saveTodos()
//             todoUpdateTask(task_id, task_update)
//             log('服务器更新任务成功！')
//         }
//     })
// }

var __main = function(){
    bindEventButtons()
}
