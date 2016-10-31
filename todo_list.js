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


// 使用阿贾克斯获取所有TODO task
var ajaxGetAll = function(){
    $.ajax({
        type: 'get',
        url: '/todo/all',
        success: function(r){
            console.log(r)
        }
    })
}
