const {Router} = require('express');
const router = Router();
const controller = require('../controllers/products.controller');
const {resolve,extname} = require('path');
const {existsSync,mkdirSync} = require('fs');

const multer = require('multer');

const destination = function(req,file,cb){
    let folder = resolve(__dirname,'..','..','public','products');
    if(!existsSync(folder)){
        mkdirSync(folder)
    }
    return cb(null,folder)
};

const filename = function(req,file,cb){
    let unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let name = file.fieldname + '-' + unique + extname(file.originalname);
    return cb(null,name)
};

const upload = multer({
    storage:multer.diskStorage({destination,filename})
});

//single('filename') 1 solo archivo -> req.file
//any() cualquier archivo (cualquier cantidad de archivos) -> req.files

router.get('/productos/nuevo',controller.create);

router.post('/productos/guardar',upload.any(), controller.save);

router.put('/productos/actualizar',upload.any(), controller.update);

router.get('/productos/:categoria?',controller.index);

router.get('/productos/detalle/:producto',controller.show);

router.get('/productos/editar/:producto',controller.edit);

router.delete('/productos/borrar', controller.remove)


module.exports = router; 