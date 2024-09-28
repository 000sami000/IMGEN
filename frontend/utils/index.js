import FileSaver from 'file-saver'

function downloadFile(_id,photo){
    FileSaver.saveAs(photo,`img_${_id}.jpg`)
}

export {downloadFile}