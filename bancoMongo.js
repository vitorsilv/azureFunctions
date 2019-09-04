const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://linx-play:AW0lyOsJcsBSiMjb4VyTyZvg7C8K1XihfPK8VYvw33zXsDOUfQQGl40mZQlyBmxZYC6q4lz8X5BWSVWYf9DC2A%3D%3D@linx-play.documents.azure.com:10255/?ssl=true';
const dbName = 'BancoDev';
const client = new MongoClient(url);

function conectar(){
    client.connect(function(err) {
        assert.equal(null, err);
        console.log(`Conectado com sucesso ao MongoDB: ${dbName}`);
        const db = client.db(dbName);
    });
}

function inserirDados(collection, dados){

    client.connect(function(err) {
        assert.equal(null, err);
        console.log(`Conectado com sucesso ao MongoDB: ${dbName}`);
        const db = client.db(dbName);

        db.collection(collection).insertMany(dados, function (err, r) {
            assert.equal(null, err);
            assert.equal(dados.length, r.insertedCount);
            console.log(`Foram inseridos ${r.insertedCount} novos registros`);
        });

        desconectar();
    });    

 //    console.log(`nome do db: ${db}`);
 //    db.collection(collection).insertMany(dados, function (err, r) {
 //        assert.equal(null, err);
 //        assert.equal(dados.length, r.insertedCount);
 //        console.log(`Foram inseridos ${r.insertedCount} novos registros`);
 //    });   
}

function deletarDados(collection){

    client.connect(function(err) {
        assert.equal(null, err);
        console.log(`Conectado com sucesso ao MongoDB: ${dbName}`);
        const db = client.db(dbName);

        db.collection(collection).drop()
        console.log(`A collection ${collection} foi deletada com sucesso!`);
    });
    desconectar();
}

function desconectar(){
    client.close(function(err){
        assert.equal(null, err);
        console.log(`Desconectado do MongoDB ${dbName}`);
    });
}

module.exports = {
    conectar, inserirDados, desconectar, deletarDados
}