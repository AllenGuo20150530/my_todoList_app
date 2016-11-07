// // 定义自己的log
var log = function() {
    console.log.apply(console, arguments)
}

// todo-cell的模板


var templateTodo = function(todo) {
    /*   todo =
    "time": 1476083080,
    "id": 75,
    "task": "to have dinner"
    "checked": "Done"
    }*/
    if(todo.checked === 'Done') {
        var t = `
            <tr class='success'>
                <td>
                    <input class='todo-done' type="checkbox" checked='checked'>
                </td>
                <td>
                    <span class='glyphicon glyphicon-remove'></span>
                    <span contenteditable='false'>${todo.id}</span>
                </td>
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
                <td>
                    <span class='glyphicon glyphicon-remove'></span>
                    <span contenteditable='false'>${todo.id}</span>
                </td>
                <td>
                    <span class="glyphicon glyphicon-pencil"></span>
                    <span class='todo-task' contenteditable='false'>${todo.task}</span>
                </td>
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
    log('要删除todo的id为-->', todoId)
    var request = {
                url: '/todo/delete',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({id: todoId}),
                success: function(r) {
                    console.log('OK, 删除已成功！',arguments)
                    console.log('r--->', r)
                    // var todo = JSON.parse(r)
                    // insertTodo(todo)
                },
                error: function() {
                    console.log('err',arguments)
                }
            }
    log('request已生成！')
    $.ajax(request)
    log('已提出阿贾克斯请求！')
}

// update todo
var ajaxUpdateTodo = function(todo){
    log('开始更新todos！')
    log('传入的todo为：', todo)
    var request = {
                url: '/todo/update',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(todo),
                success: function(r) {
                    console.log('OK，更新完成！',arguments)
                    console.log('r--->', r)
                    // var todo = JSON.parse(r)
                    // insertTodo(todo)
                },
                error: function() {
                    console.log('err',arguments)
                }
            }
    log('request已生成！')
    $.ajax(request)
    log('已提出阿贾克斯请求！')
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
var bindEventTable = function() {
    $('.table').on('click', function(event){
        var target = $(event.target)
        log('target-->' ,target)
        if(target.hasClass('todo-done')){
            var tr = target.parent().parent()
            log('parent-->',tr)
            if (target[0].hasAttribute('checked')) {
                log('点击时，状态为：Done')
                todoUndone(target)
                var todo = todoGenerator(tr)
                log('todo-->', todo)
                ajaxUpdateTodo(todo)
            }else if (!target[0].hasAttribute('checked')) {
                log('点击时，状态为：Undone')
                // 点击的是check按钮，且未完成，则标记为浅绿色
                todoDone(target)
                var todo = todoGenerator(tr)
                log('todo-->', todo)
                ajaxUpdateTodo(todo)
            }
        }else if (target.hasClass('glyphicon-pencil')) {
            todoEdit(target)
        }else if (target.hasClass('glyphicon-remove')) {
            log(event.target)
            log($(event.target).parent()[0])
            log('您确定删除此todo task！')
            var td = $(event.target).parent()
            // 标记要删除的td
            td.addClass('td-delete')
            $('.alert-container').removeClass('alert-off')
            log('标记task所在父级',$(td[0]))

        }
    })
}

var bindEventCancel = function() {
    $('#id-button-cancel').on('click', function(){
        $('.alert-container').addClass('alert-off')
    })
}
var bindEventOk = function() {
    $('#id-button-ok').on('click', function(){
        var td = $('.td-delete')
        var id = $(td.children()[1]).text()
        log('要删除的id-->', id)
        ajaxDeleteTodo(id)
        // 移除删除的task cell
        td.parent().remove()
        $('.alert-container').addClass('alert-off')
    })
}
var todoGenerator = function(tr) {
    log('todo正在生成中！')
    var todo = {}
    var children = tr.children()
    todo.id = Number($(children[1]).text())
    log('当前id-->',todo.id)
    todo.task = $($(children[2]).children()[1]).text()
    log("当前task-->",todo.task)
    // todo.checked = status
    todo.checked = $(children[4]).text()
    log('当前checked-->',todo.checked)
    log('todo已生成！', todo)
    return todo
}
var todoUndone = function(target) {
    log(target[0].hasAttribute('checked'))
    log('开始将Done状态修改为Undone状态······')
    // 点击的是check按钮，已完成变为未完成
    var tr = target.parent().parent()
    log('目标所在tr为:', tr)
    tr.removeClass('success')
    // 将status标记为完成
    var status = $(tr.children()[4])
    status.text('Undone')
    log('状态已修改为：', status.text())
    // 将check box属性设置为checked
    target[0].removeAttribute('checked')
    log('状态修改已完成！')
}
var todoDone = function(target) {
    // 点击的是check按钮，且未完成，则标记为浅绿色
    log(target[0].hasAttribute('checked'))
    log('开始将Undone状态修改为Done状态······')
    // 点击的是check按钮，已完成变为未完成
    var tr = target.parent().parent()
    log('目标所在tr为:', tr)
    tr.addClass('success')
    // 将status标记为完成
    var status = $(tr.children()[4])
    status.text('Done')
    log('状态已修改为：', status.text())
    // 将check box属性设置为checked
    target[0].setAttribute('checked', 'checked')
    log('状态修改已完成！')
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

// 所有的点击button的事件
var bindEventButtons = function() {
    bindEventQuery()
    bindEventAdd()
    bindEventCancel()
    bindEventTable()
    bindEventOk()
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
