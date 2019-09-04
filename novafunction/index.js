const axios = require('axios');
const bancoSQL = require('../bancoSQL');
const bancoMongo = require('../bancoMongo');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body && req.body.collectionDestino) {
        context.log('Inicio da function')
        await bancoSQL.conectar();
        context.log('Abriu o SQL')

        let consulta = await bancoSQL.sql.query(`SELECT 
        CONVERT(VARCHAR, idFuncionario)+'-' + 
        CONVERT(VARCHAR, cpfFuncionario) AS [_id],
        nomeFuncionario, rgFuncionario,cpfFuncionario,
        emailFuncionario, telefoneFuncionario, cargoFuncionario
        FROM Funcionario;`);
        
        let dados = consulta.recordset;
        
        await bancoMongo.inserirDados(req.body.collectionDestino, dados);
        
        context.res.body = {dados};

        context.log(dados)
        await bancoSQL.desconectar();
        context.log('Fechou o banco SQL')
    }
    else {
        context.res = {
            status: 400,
            body: "Erro, envie um JSON com o parametro 'collectionDestino' para obter um retorno válido"
        };
    }
    context.done();
};