const {all,one,generate, write} = require('../models/products.model');
const {unlinkSync} = require('fs');
const {resolve} = require('path');

const controller = {

    index: (req,res) =>{

        let products = all();
    
        if(req.params.categoria){
            products = products.filter(e => e.category == req.params.categoria);
            return res.render('list',{products});
        }
    
        return res.render('list',{products});
    },

    show: (req,res) => {
        let product = one(req.params.producto);
        
        if(product){
            return res.render('detail',{product});
        }
    
        return res.render('detail', {product:null});
    },
    
    create: (req,res) => {
        return res.render('create');
    },
    
    save: (req,res) => {
        req.body.image = req.files && req.files.length > 0 ? req.files[0].filename : 'default.png'
      
        let nuevo = generate(req.body);
        let todos = all();
        todos.push(nuevo);
        write(todos);
        return res.redirect('/productos/');
    },
    
    edit: (req,res) => {
        let product = one(req.params.producto)
        return res.render('edit',{product})
    },
   
    update: (req,res) => {

//        if(req.files && req.files.length > 0){
//            return res.send({archivos:req.files})
//        }

        let todos = all();
        let actualizados = todos.map(elemento => {
            if(elemento.id == req.body.id){
                elemento.name = req.body.name;
                elemento.price = parseInt(req.body.price);
                elemento.category = req.body.category;
                elemento.image = req.files && req.files.length > 0 ? req.files[0].filename : elemento.image;
                let product = one(req.body.id);
                if(product.image != 'default.png'){
                    let file = resolve(__dirname,'..','..','public','products',product.image);
                    unlinkSync(file);
                }
            }
            return elemento
        })
        write(actualizados)
        return res.redirect('/productos/')
    },
    
    remove: (req,res) => {
        let product = one(req.body.id);
        if(product.image != 'default.png'){
            let file = resolve(__dirname,'..','..','public','products',product.image);
            unlinkSync(file);
        }
        let todos = all()
        let noEliminados = todos.filter(e => e.id != req.body.id);
        write(noEliminados);
        return res.redirect('/productos/');
    }
}


module.exports = controller; 