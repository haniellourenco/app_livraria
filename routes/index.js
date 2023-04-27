var express = require('express')
var router = express.Router()

/* GET home page. */

/*router.get('/', function(req, res, next) {
  res.render('index');
})*/

router.get('/', async function(req, res) {
  try
  {
    if (!global.usuariocodigo || global.usuariocodigo == 0)
    {
      res.redirect('/login')
    }

    const registros = await global.db.listarLivros()
    const usu = global.usuariologin
    res.render('index', { registros, usu })
  }
  catch(error)
  {
    res.redirect('/?erro='+error);
  }
  
})


router.get('/sair', function(req, res){
  global.usuario = 0
  res.redirect('/')
})

router.get('/login', function(req, res){
  res.render('login')
})


router.post('/login', async function(req, res){
  const usuario = req.body.edtUsuario 
  const senha   = req.body.edtSenha
  
  const user = await global.db.buscarUsuario({usuario,senha})

  global.usuariocodigo = user.usucodigo
  global.usuariologin  = user.usulogin
  res.redirect('/')
})

router.get('/livroNovo', function(req, res, next){
  //res.render('formLivro', { title: "Cadastro de Livro", action: "/livroNovo" })
  res.render('formLivro', { title: "Cadastro de Livro", registro:{}, action: "/livroNovo" })
})


router.get('/livroApaga/:id', async function(req,res){
  const codigo = parseInt(req.params.id)
  try
  {
    await global.db.apagarLivro(codigo)
    res.redirect('/')
  }
  catch(erro)
  {
    res.redirect('/?erro='+erro)
  }
})


router.get('/livroAltera/:id', async function(req,res){
  const codigo = parseInt(req.params.id)
  try
  {
    const registro = await global.db.selecionarLivro(codigo)
    res.render('formLivro', {title: "Alteração de Livro", registro, action: "/livroAltera/"+codigo })
  }
  catch(erro)
  {
    res.redirect('/?erro='+erro)
  }
})


router.post('/livroNovo', async function(req, res) {
  const titulo = req.body.edtTitulo 
  const ano    = !req.body.edtAno ? null : parseInt(req.body.edtAno)
  const genero = !req.body.cmbGenero ? null : parseInt(req.body.cmbGenero)

  try
  {
    await global.db.inserirLivro({titulo, ano, genero})
    res.redirect('/')
  }
  catch(erro)
  {
    res.redirect('/?erro='+erro)
  }
})


router.post('/livroAltera/:id', async function(req, res) {
  const codigo = parseInt(req.params.id)
  const titulo = req.body.edtTitulo 
  const ano    = !req.body.edtAno ? null : parseInt(req.body.edtAno)
  const genero = !req.body.cmbGenero ? null : parseInt(req.body.cmbGenero)

  try
  {
    await global.db.alterarLivro({titulo, ano, genero, codigo})
    res.redirect('/')
  }
  catch(erro)
  {
    res.redirect('/?erro='+erro)
  }
})

module.exports = router;
