const axios = require('axios');
const bancoSQL = require('../bancoSQL');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
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
        
    context.res.body = dados;

    context.log(dados)
    await bancoSQL.desconectar();
    context.log('Fechou o banco SQL')
    context.done();
};