
const config = require('../config');
const fsAsync = require('../libs/fsAsync');

async function post(ctx) {

    try {
        const fs = require('fs');
        const request = require('request');

        const file = ctx.request.body.doc;
        const token = ctx.request.body.token;

        const url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
        const filePath = config.directories.readyFiles + '/' + file.name;

        const fileStream = fs.createWriteStream(filePath);
        const stream = request.get({uri:url, headers:{'Authorization':'Bearer ' + token}});
        await fsAsync.saveStream(stream, fileStream);

        ctx.body = {path: filePath.substr(1), name: file.name};

    } catch (err) {
        ctx.throw (500, config.error.serverError);
    }
}

module.exports.post = post;