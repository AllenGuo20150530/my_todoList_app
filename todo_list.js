// // 定义自己的log
var log = function() {
    console.log.apply(console, arguments)
}

// todo-cell的模板

// var templateTodo = function(todo) {
//     /*   todo =
//     "created_time": 1476083080,
//     "id": 75,
//     "task": "to have dinner"
//     }*/
//     var t = `
//         <div class='todo-cell'>
//             <button class='todo-done'>完成</button>
//             <button class='todo-delete'>删除</button>
//             <button class='todo-edit'>编辑</button>
//             <span>${todo.id}</span>
//             <span class='todo-label' contenteditable='false'>${todo.task}</span>
//         </div>
//     `
//     return t
// }
var templateTodo = function(todo) {
    /*   todo =
    "time": 1476083080,
    "id": 75,
    "task": "to have dinner"
    "checked": "Done"
    }*/
    if(todo.checked === "Done") {
        var t = `
            <tr class='success'>
                <td>
                    <input class='todo-done' type="checkbox" checked='checked'>
                </td>
                <td>${todo.id}</td>
                <td>
                    <span class="glyphicon glyphicon-pencil"></span>
                    <span class='todo-task' contenteditable='false'>${todo.task}</span>
                </td>
                <td>${todo.time}</td>
                <td>${todo.checked}</td>
            </tr>
        `
    }else if (todo.checked === "Undone") {
        var t = `
            <tr>
                <td>
                    <input class='todo-done' type="checkbox">
                </td>
                <td>${todo.id}</td>
                <td><span class='todo-task' contenteditable='false'>${todo.task}</span></td>
                <td>${todo.time}</td>
                <td>${todo.checked}</td>
            </tr>
        `
    }else if (todo.checked === "Deleted") {
        var t = `
            <tr class='danger'>
                <td>
                    <input class='todo-done' type="checkbox">
                </td>
                <td>${todo.id}</td>
                <td><span class='todo-task' contenteditable='false'>${todo.task}</span></td>
                <td>${todo.time}</td>
                <td>${todo.checked}</td>
            </tr>
        `
    }
    return t
}
// 插入一个todo-cell
var insertTodo = function(todo) {
    log('insertTodo 开始！')
    var t = templateTodo(todo)
    log('要添加的代码：', t)
    log('tbody-->', $('tbody'))
    // 添加到 container 中
    $('tbody').append(t)
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
                    // var todo = JSON.parse(r)
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
        $('tbody').empty()
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
        // bindEventButtons()
        $('#id-input-todo').val('')
    })
}
var bindEventDone = function() {
    $('.table').on('click', function(event){
        var target = $(event.target)
        log('target-->' ,target)
        if(target.hasClass('todo-done')){
            var tr = target.parent().parent()
            log('parent-->',tr)
            if (target[0].hasAttribute('checked')) {
                todoUndone(target)
                var tr = target.parent().parent()
                var todo = todoGenerator(tr)
                log('todo-->', todo)
                // ajaxUpdateTodo(todo)
            }else if (!target[0].hasAttribute('checked')) {
                log(target[0].hasAttribute('checked'))
                // 点击的是check按钮，且未完成，则标记为浅绿色
                tr.addClass('success')
                // 将status标记为完成
                var status = $(tr.children()[4])
                log('status-->', status)
                status.text('Done')
                log('status-->', status.text())
                // 将check box属性设置为checked
                target[0].setAttribute('checked', 'checked')
            }
        }else if (target.hasClass('glyphicon')) {
            todoEdit(target)
        }
    })
}
var todoGenerator = function(tr, status) {
    log('todo正在生成中！')
    var todo = {}
    todo.id = Number($(tr.children()[1]).text())
    log(todo.id)
    todo.task = $($(tr.children()[2]).children()[1]).text()
    log(todo.task)
    // todo.checked = status
    todo.checked = $(tr.children()[4]).text()
    log(todo.checked)
    log('todo已生成！-->', todo)
}
var todoUndone = function(target) {
    log(target[0].hasAttribute('checked'))
    // 点击的是check按钮，已完成变为未完成
    var tr = target.parent().parent()
    tr.removeClass('success')
    // 将status标记为完成
    var status = $(tr.children()[4])
    log('status-->', status[0])
    status.text('Undone')
    log('status-->', status.text())
    // 将check box属性设置为checked
    target[0].removeAttribute('checked')
}

var todoEdit = function(target) {
    log('target has Class "glyphicon"')
    var td = target.parent()
    log('td-->', td)
    var todoSpan = $(td.children()[1])
    log('task span-->', todoSpan)
    todoSpan.attr('contenteditable', true)
    todoSpan.focus()
}
// 点击 task cell 上的按钮时按钮时使事件加一条删除线
// var bindEventCell = function() {
//     $('.table').on('click', function(event){
//         var target = $(event.target)
//         log('target-->' ,target)
//         var tr = target.parent().parent()
//         log('parent-->',tr)
//         if(target.hasClass('todo-done')) {
//             // 点击的是check按钮，则标记为浅绿色
//             tr.addClass('success')
//         // }else if (target.hasClass('todo-done')) {
//         //     // 点击 完成 按钮时使事件加一条删除线
//         //     parent.addClass('todo-complete')
//         // }else if (target.hasClass('todo-delete')) {
//         //     // 给删除按钮添加删除事件
//         //     var id = $(parent.children()[3]).text()
//         //     var todoId = Number(id)
//         //     log(typeof todoId)
//         //     ajaxDeleteTodo(todoId)
//         //     // 移除删除的task cell
//         //     parent.remove()
//         // }
//     })
// }

// 所有的点击button的事件
var bindEventButtons = function() {
    bindEventQuery()
    bindEventAdd()
    // bindEventCell()
    bindEventDone()
}
// 绑定编辑按钮，回车时更新
var bindEventEnter = function() {
    $('tbody').on('keydown', function(event){
        log(event.target)
        log(event.key)
        var target = $(event.target)
        if(event.key === 'Enter') {
            // 失去焦点
            target.blur()
            // 阻止默认行为的发生, 也就是不插入回车
            event.preventDefault()
            target.attr('contenteditable', false)
            var tr = target.parent().parent()
            var td = target.parent()
            var todo = {}
            var id = $(tr.children()[1]).text()
            todo.id = Number(id)
            todo.task = $(td.children()[1]).text()
            todo.checked = $(tr.children()[4]).text()
            ajaxUpdateTodo(todo)
        }
    })
}


var __main = function(){
    bindEventButtons()
    bindEventEnter()
}
