
const config = require('../config');
const fsAsync = require('../libs/fsAsync');

async function folderCleaner() {
    try {
        await fsAsync.folderCleaner(config.directories.readyFiles);
    } catch (err) {
        console.log(`folderCleaner error: ${err.message}`);
    }
}

async function makeFolder() {
    try {
        await fsAsync.makeDir(config.directories.readyFiles);
    } catch (err) {
        console.log(`Folder ${config.directories.readyFiles} exists`);
    }
}

async function get (ctx) {

    let options = {
        title: "Google Drive picker (загрузка файлов). Koa2 RESTful API. #BlondieCode"
    };

    await makeFolder();
    await folderCleaner();
    return ctx.render('main', { options: options });
}

module.exports.get = get;