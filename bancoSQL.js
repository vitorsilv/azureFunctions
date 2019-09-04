const sql = require('mssql');

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
    console.log('Bem-vindo ao banco SQL!')
    return sql.connect(configuracoes[perfil]);
    // return new sql.ConnectionPool();  
}

function desconectar(){
    console.log('Você foi desconectado do banco SQL');
    return sql.close();
}

module.exports = {
    conectar, desconectar, sql
}