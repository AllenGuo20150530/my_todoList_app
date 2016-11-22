// var todos = {
//     folder: [
//         {
//             folderName: 'Default',
//             folderId: 0
//         },
//         {
//             folderName: 'js',
//             folderId: 1,
//         }
//     ],
//     todo: [
//         {
//             id: 1,
//             task: 'DOM 操作',
//             time: '201609',
//             checked: 'Done',
//             folderId: 1
//         }
//     ]
// }



// 切换folder
// var folders = document.querySelector('#id-div-folder')
// folders.addEventListener('click', function(event){
//     var target = event.target
//     if (target.classList.contains('folder-i')) {
//         var targetId = target.dataset.folderid
//         var targetName = target.innerText
//         // dataset.folderId出错
//         log(targetId, targetName)
//         var folderButton = document.querySelector('#id-button-folder')
//         var folderName = folderButton.innerText
//         var folderId = folderButton.dataset.folderid
//         log(folderId, folderName)
//         folderButton.innerHTML = targetName + '<span class="caret"></span>'
//         folderButton.dataset.folderid = targetId
//
//         target.dataset.folderid = folderId
//         target.innerText = folderName
//     }
// })

// 添加新的folder
// var newFolder = document.querySelector('#id-input-newFolder')
// newFolder.addEventListener('keydown', function(event){
//     if(event.key == 'Enter') {
//         var folders = document.querySelectorAll('.folder-i')
//         var len = folders.length
//         var lastFolder = folders[len - 1]
//         var lastId = Number(lastFolder.dataset.folderid)
//         log(lastId)
//         var folder = newFolder.value
//         var temp = `
//             <li><a class='folder-i' data-folderid=${lastId + 1}>${folder}</a></li>
//         `
//         document.querySelector('.divider').insertAdjacentHTML('beforebegin', temp)
//         newFolder.value = ''
//     }
// })
// jQuery 实现并封装函数

// 添加新folder
var bindNewFolder = function() {
    $('#id-input-newFolder').on('keydown', function(event){
        if(event.key == 'Enter') {
            var folders = $('.folder-i')
            var len = folders.length
            var lastFolder = $(folders[len - 1])
            var lastId = Number(lastFolder.data('folderid'))
            log(lastId)
            var folder = $('#id-input-newFolder').val()
            var temp = `
                <li><a class='folder-i' data-folderid=${lastId + 1}>${folder}</a></li>
            `
            $('.divider').before(temp)
            newFolder.value = ''
            /*
            *清空table
            *Todos新增新空list
            */
        }
    })
}

// 切换folder
var bindSwitchFolder = function() {
    $('#id-div-folder').on('click', function(event){
        var target = $(event.target)
        if (target.hasClass('folder-i')) {
            // 点击目标为folder聊表中的folder项
            switchFolder(target)
            // display相应的list
        }
    })
}
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

// 删除一个folder
var bindDeleteFolder = function() {
    $('#id-button-delete-folder').on('click', function(event){
        log(event.target)
        var folderButton = $('#id-button-folder')
        var folderName = folderButton.text()
        var folderId = folderButton.data('folderid')
        // 删除之后显示default的task
        $('a[data-folderid=0]').parent().remove()
        folderButton.html('Default<span class="caret"></span>')
        folderButton.attr('data-folderid', '0')
        // todos中删除相应的list
    })
}
bindDeleteFolder()


var bindEvents = function() {
    bindSwitchFolder()
    bindNewFolder()
}

$(document).ready(function(){
    bindEvents()
})
