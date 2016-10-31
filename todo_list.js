// 定义自己的log
var log = function() {
    console.log.apply(console, arguments)
}

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
