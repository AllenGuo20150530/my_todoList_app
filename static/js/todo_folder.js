/* todo_folder.js
    *folder的新建和删除
    *切换folder时会将相应的显示
    *delete一个folder，会将Todos完全删除
    *暂时delete时没有危险提示，可以加上
*/

// post a ajax request to update the folders
var ajaxUpdateFolder = function(folderArray) {
        log('开始更新folders！')
        log('传入的folder为：', folderArray)
        var request = {
                    url: '/folder/update',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify(folderArray),
                    success: function(r) {
                        console.log('OK，更新完成！',arguments)
                        console.log('r--->', r)
                    },
                    error: function() {
                        console.log('err',arguments)
                    }
                }
        log('request已生成！')
        $.ajax(request)
        log('已提出阿贾克斯请求！')
}

// post a ajax request to get all the todos of the folder with folderId
var ajaxGetFolder = function(folderId) {
    log('开始获取folder里的全部todos！')
    log('传入的folderId为：', folderId)
    var request = {
                url: '/folder/get',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify([folderId]),
                success: function(response) {
                    console.log('OK，完成获取！',arguments)
                    console.log('r--->', response)
                    $('tbody').empty()
                    var todos = JSON.parse(response)
                    for (var i = 0; i < todos.length; i++) {
                        var todo = todos[i]
                        insertTodo(todo)
                    }
                },
                error: function() {
                    console.log('err',arguments)
                }
            }
    log('request已生成！')
    $.ajax(request)
    log('已提出阿贾克斯请求！')
}

// post a ajax request to delete the todos of the folder
var ajaxDeleteTodos = function(folder) {
    log('开始删除folder里的全部todos！')
    log('传入的folder为：', folder)
    var request = {
                url: '/folder/delete',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(folder),
                success: function(response) {
                    console.log('OK，完成获取！',arguments)
                    console.log('r--->', response)
                    $('tbody').empty()
                    var todos = JSON.parse(response)
                    for (var i = 0; i < todos.length; i++) {
                        var todo = todos[i]
                        insertTodo(todo)
                    }
                },
                error: function() {
                    console.log('err',arguments)
                }
            }
    log('request已生成！')
    $.ajax(request)
    log('已提出阿贾克斯请求！')
}

// 根据点击的目标来获取相应的folderName和folderId，将其放到分类按钮上
var switchFolder = function(target) {
    // 获取folder项的folderId 和 Name
    var targetId = target.attr('data-folderid')
    var targetName = target.text()
    log(targetId, targetName)
    // 获取当前folder button上显示的folder及其Name和Id
    var folderButton = $('#id-button-folder')
    var buttonName = folderButton.text()
    var buttonId = folderButton.attr('data-folderid')
    log(buttonId, buttonName)
    target.attr('data-folderid', buttonId)
    target.text(buttonName)
    folderButton.html(targetName + '<span class="caret"></span>')
    folderButton.attr('data-folderid', targetId)
}

// bind a Enter event to add a new folder
var bindNewFolder = function() {
    $('#id-input-newFolder').on('keydown', function(event){
        if(event.key == 'Enter') {
            // get all folders
            var folders = $('.folder-i')
            // get the number of folders
            var len = folders.length
            // the new folderId = 1 or n + 1 when len > 0
            var newId = '1'
            if(len > 0){
                var lastFolder = $(folders[len - 1])
                var lastId = len + 1
                log(lastId)
                newId = lastId.toString()
            }
            // get the new folder's name
            var newFolder = $('#id-input-newFolder').val()
            // insert the new folder into HTML
            var temp = `
                <li><a class='folder-i' data-folderid=${newId}>${newFolder}</a></li>
            `
            $('.divider').before(temp)
            $('#id-input-newFolder').val('')
            // call ajaxUpdateFolder() to update the todoData.folders
            ajaxUpdateFolder([newFolder, newId])
        }
    })
}

//  bind a click event to switch folders
var bindSwitchFolder = function() {
    $('#id-div-folder').on('click', function(event){
        var target = $(event.target)
        if (target.hasClass('folder-i')) {
            // 点击目标为folder列表中的folder项
            switchFolder(target)
            // display the responding list
            //get the folderId
            var folderId = getFolderId()
            log(folderId)
            ajaxGetFolder(folderId)
        }
    })
}

// 删除一个folder
var bindDeleteFolder = function() {
    $('#id-button-delete-folder').on('click', function(event){
        log('delete 按钮被点击到了')
        var folderButton = $('#id-button-folder')
        var folderName = folderButton.text()
        var folderId = folderButton.data('folderid')
        // 删除当前的所有task
        ajaxDeleteTodos([folderName,folderId])
        // 删除之后显示default的task
        $('a[data-folderid=0]').parent().remove()
        folderButton.html('Default<span class="caret"></span>')
        folderButton.attr('data-folderid', '0')
        ajaxGetFolder('0')
        // todos中删除相应的list
    })
}

// 将所有绑定的事件统一管理
var bindEvents = function() {
    bindSwitchFolder()
    bindNewFolder()
    bindDeleteFolder()
}

// 创建主函数，包括todo_list.js内的bindEventButtons()和inputInit()函数
var __main = function(){
    inputInit()
    bindEventButtons()
    bindEvents()
}

// 文档加载完成后，执行主函数__main()
$(document).ready(function(){
    __main()
})
