const bancoMongo = require('../bancoMongo');


module.exports = async function (context, req) {

    if (req.body && req.body.collectionDestino) {
        context.log('Começou');
        await bancoMongo.deletarDados(req.body.collectionDestino);
        context.log('Finalizou')
        resposta = {"mensagem":"Collection removida com sucesso do banco!"};
        context.res = {
            body: resposta
        };
    }
    else {
        resposta = {"mensagem":"Erro, envie um JSON com o parametro collectionDestino para obter um retorno válido"};
        context.res = {
            status: 400,
            body: resposta
        };
    }
    context.done();
};