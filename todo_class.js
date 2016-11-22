var todos = {
    folder: [
        {
            folderName: 'Default',
            folderId: 0
        },
        {
            folderName: 'js',
            folderId: 1,
        }
    ],
    todo: [
        {
            id: 1,
            task: 'DOM 操作',
            time: '201609',
            checked: 'Done',
            folderId: 1
        }
    ]
}

<li><a data-folderId=1>js</a></li>
// 原生JS，注意dataset内的全是小写
// 切换folder
var folders = document.querySelector('#id-div-folder')
folders.addEventListener('click', function(event){

    var target = event.target
    if (target.classList.contains('folder-i')) {
        var targetId = target.dataset.folderid
        var targetName = target.innerText
        // dataset.folderId出错
        log(targetId, targetName)
        var folderButton = document.querySelector('#id-button-folder')
        var folderName = folderButton.innerText
        var folderId = folderButton.dataset.folderid
        log(folderId, folderName)
        folderButton.innerHTML = targetName + '<span class="caret"></span>'
        folderButton.dataset.folderid = targetId

        target.dataset.folderid = folderId
        target.innerText = folderName
    }
})

var newCat

// 添加新的folder
var newFolder = document.querySelector('#id-input-newFolder')
newFolder.addEventListener('keydown', function(event){
    if(event.key == 'Enter') {
        var folders = document.querySelectorAll('.folder-i')

        var len = folders.length
        var lastFolder = folders[len - 1]
        var lastId = Number(lastFolder.dataset.folderid)
        log(lastId)
        var folder = newFolder.value
        var temp = `
            <li><a class='folder-i' data-folderid=${lastId + 1}>${folder}</a></li>
        `
        document.querySelector('.divider').insertAdjacentHTML('beforebegin', temp)
        newFolder.value = ''
    }
})
$('#id-button-folder').text()
