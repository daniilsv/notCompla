import * as fs from 'fs';
import imageExtensions from 'image-extensions';
import * as mkdirp from 'mkdirp';
import * as multer from 'multer';
import { extname, join } from 'path';
import * as sharp from 'sharp';

const extensions = new Set(imageExtensions);

const isImage = filePath => extensions.has(extname(filePath).slice(1).toLowerCase());

export default class ResizeStorage implements multer.StorageEngine {

    getFilename(req, file, cb) {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
    }
    getDestination(req, file, cb) {
        cb(null, '');
    }

    constructor(opts) {
        this.getFilename = (opts.filename || this.getFilename)

        if (typeof opts.destination === 'string') {
            mkdirp.sync(opts.destination)
            this.getDestination = function ($0, $1, cb) { cb(null, opts.destination) }
        } else {
            this.getDestination = (opts.destination || this.getDestination)
        }
    }

    _handleFile = (req, file, cb) => {
        this.getDestination(req, file, (err, destination) => {
            if (err) return cb(err);
            this.getFilename(req, file, (err, filename) => {
                if (err) return cb(err);
                const finalPath = join(destination, filename);
                const outStream = fs.createWriteStream(finalPath);
                let stream = file.stream;
                stream.on('error', (e) => { console.log(e); cb(e); });
                if (isImage(finalPath)) {
                    try {
                        const resizer = sharp().ensureAlpha().resize(320, 320, { fit: 'outside' });
                        stream = stream.pipe(resizer);
                    } catch (e) {
                        console.error(e);
                    }
                }
                stream.on('error', (e) => { console.log(e); cb(e); });
                stream.pipe(outStream);
                outStream.on('finish', function () {
                    cb(null, {
                        destination: destination,
                        filename: filename,
                        path: finalPath,
                        size: outStream.bytesWritten,
                    })
                });
                outStream.on('error', (e) => { console.log(e); cb(e); });
            });

        });
    }
    _removeFile = (req, file, cb) => {
        const path = file.path;

        delete file.destination
        delete file.filename
        delete file.path

        fs.unlink(path, cb)
    };
}

export function storageEngine(opts) {
    return new ResizeStorage(opts);
}
