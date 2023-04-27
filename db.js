const mysql = require('mysql2/promise'); 

async function conectarBD()
{ 
    if(global.connection && global.connection.state !== 'disconnected') 
    {
        return global.connection
    }
    
    /*
    const connectionString = 'mysql://root:senha@localhost:3306/livraria' 
    const connection= await mysql.createConnection(connectionString)
    */
    
    const connection = await mysql.createConnection(
        { 
            host     : 'localhost', 
            port     : 3306, 
            user     : 'root',
            password : '', 
            database : 'livraria' 
        }); 
        
    console.log('Conectou no MySQL!'); 
    
    global.connection = connection; 

    return global.connection; 
} 


async function listarLivros()
{
    const conn = await conectarBD()
    const [registros] = await conn.query('SELECT * FROM livros;')
    return registros
}


async function inserirLivro(livro)
{
    const conn = await conectarBD()
    const sql = "insert into livros (livtitulo, livano, gencodigo) values (?,?,?);"
    return await conn.query(sql,[livro.titulo, livro.ano, livro.genero])
}


async function selecionarLivro(codigo)
{
    const conn = await conectarBD()
    const sql = "select * from livros where livcodigo=?;"
    const [registro] = await conn.query(sql,[codigo])
    return registro && registro.length>0 ? registro[0] : {}
    /**
     * 
     * if(rows && rows.length > 0) 
     *   return rows[0] 
     * else 
     *   return {}
     */
}

async function alterarLivro(livro)
{
    const conn = await conectarBD()
    const sql = "update livros set livtitulo=?, livano=?, gencodigo=? where livcodigo=?;"
    return await conn.query(sql,[livro.titulo, livro.ano, livro.genero, livro.codigo])
}


async function apagarLivro(codigo)
{
    const conn = await conectarBD()
    const sql = "delete from livros where livcodigo=?;"
    return await conn.query(sql,[codigo])
}


async function buscarUsuario(us)
{
    const conn = await conectarBD()
    const sql = "select * from usuarios where usulogin=? and ususenha=?;"
    const [usuarioEcontrado] = await conn.query(sql,[us.usuario, us.senha])
    return usuarioEcontrado && usuarioEcontrado.length>0 ? usuarioEcontrado[0] : {}
}


conectarBD()

module.exports = { listarLivros , inserirLivro, selecionarLivro, alterarLivro, apagarLivro, buscarUsuario }



