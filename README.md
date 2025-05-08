# eslint-prettier
#### Eslint + Prettier setup without headaches and conflicts  

### Instalação e configuração do TypeScript  

* Caso já tenha feito isso, pule direto para a segunda parte, instalação do Eslint + Prettier

1 - Inicialize um novo projeto:
```sh
npm init -y
```

2 - Instale o TypeScript e os Types do Node:
```sh
npm install typescript @types/node -D
```

3 - Inicialize o TypeScript
```sh
npx tsc --init 
```

4 - Acesse as configurações recomendadas para a versão do NodeJs instalada:  
[Node Target Mapping](https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping)

Meu Node (node -v) atual v22.14.0, então a configuração é **Node 20**. 
No **tsconfig.json** modifique:  
```json
{
  "compilerOptions": {
    "lib": ["ES2023"],
    "module": "node16",
    "target": "ES2023"
  }
}
```  

5 - Crie a pasta **src** e **index.ts** dentro com um simples console.log:  
```js
const lang = "TypeScript";

console.log(`Hello World from ${lang}!`);
```  

6 - Adicione a pasta **src** no **tsconfig.json** em **rootDirs** e em **outDir** adicione **dist**:  

```json
"rootDirs": [
    "./src"
],
```
E também:
```json
"outDir": "./dist",
```

7 - Instale o TSX para rodar e monitorar as alterações:  
```sh
npm install tsx -D
```

8 - Na parte de **scripts** do **package.json** adicione:
```js
// "scripts": {
  "dev": "tsx watch src/index.ts",
  "compile": "npx tsc",
  "start": "node dist/index.js"
//}
```

9 - Execute no modo de desenvolvimento:
```sh
npm run dev 
```
Deve sair no console:  
**Hello World from TypeScript!**

10 - Compile:
```sh
npm run compile 
```
Deve criar a pasta **dist** com **index.js** dentro

11 - Execute no modo de produção:
```sh
npm start
```
Deve sair no console:  
**Hello World from TypeScript!** só que dessa vez rodando o .js da pasta dist

12 - Crie um .gitignore contendo:
```ini
# Node Modules
node_modules

# Dist Folder
dist
```

13 - Caso precise rodar um unico aquivo **.ts** via terminal use **npx tsx** arquivo.ts:  
```sh
npx tsx src/index.ts 
```


