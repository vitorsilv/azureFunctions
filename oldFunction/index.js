const sql = require('mssql');
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');


module.exports = function (context, req) {
    var desenvolvimento = false;

    var configuracoes = {
        producao: {
            server: "srv01191041.database.windows.net",
            user: "vitor01191041",
            password: "#Gf48005253818",
            database: "bdProjeto",
            options: {
                encrypt: true
            },
            pool: {
                max: 4,
                min: 1,
                idleTimeoutMillis: 30000
            }
        },
        desenvolvimento: {
            server: "BASETESTE.database.windows.net",
            user: "usuariotestes",
            password: "senhatestes",
            database: "BASETESTE",
            options: {
                encrypt: true
            }
        }
    }

    sql.on('error', err => {
        console.error(`Erro de Conexão: ${err}`);
    });

    var perfil = desenvolvimento ? 'desenvolvimento' : 'producao';

    function conectar() {
        return sql.connect(configuracoes[perfil])
        // return new sql.ConnectionPool();  
    }

    let resposta;
    inicia();

    function inicia() {

        sql.close();
        conectar().then(() => {
            return sql.query(`SELECT 
            CONVERT(VARCHAR, idFuncionario)+'-' + 
            CONVERT(VARCHAR, cpfFuncionario) AS [_id],
            nomeFuncionario, rgFuncionario,cpfFuncionario,
            emailFuncionario, telefoneFuncionario, cargoFuncionario
            FROM Funcionario;`);
        }).then(consulta => {
            resposta = consulta.recordset;
            console.log(resposta);
            mongoClient.connect("mongodb://linx-play:AW0lyOsJcsBSiMjb4VyTyZvg7C8K1XihfPK8VYvw33zXsDOUfQQGl40mZQlyBmxZYC6q4lz8X5BWSVWYf9DC2A%3D%3D@linx-play.documents.azure.com:10255/?ssl=true", function (err, client) {
                const db = client.db('BancoDev');
                assert.equal(null, err);
                console.log("Conectado com sucesso!!");

                db.collection(req.body.collectionDestino).insertMany(resposta, function (err, r) {
                    assert.equal(null, err);
                    assert.equal(resposta.length, r.insertedCount);
                    console.log(`Foram inseridos ${r.insertedCount} novos registros`)

                    client.close();
                });
            });
            if (true) {
                context.res.body = {resposta};
            } else {
                context.res = {
                    status: 400,
                    body: "Erro, envie um JSON com os parametros 'tabelaOrigem', 'bancoDestino' e 'collectionDestino' para obter um retorno válido"
                };
            }
            context.done();
        });
    }
};