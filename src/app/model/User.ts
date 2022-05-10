export class User {
    nome:string;
    username:string;
    senha:string;

    constructor(nome:string, username: string, senha: string) {
        this.nome = nome;
        this.username = username;
        this.senha = senha;
    }
}