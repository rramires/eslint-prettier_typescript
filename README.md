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

--- 

### Instação e configuração do Eslint + Prettier

* Na versão mais nova do Eslint, não é mais papel do Eslint verificar estilos. Por isso não tem mais as opções de escolher os modelos do Airbnb, Google, etc  
Para isso devemos usar o Prettier daqui pra frente para formatação do código.

1 - Instale o Eslint:  
[Getting Started with ESLint](https://eslint.org/docs/latest/use/getting-started)
```sh
npm init @eslint/config@latest
```  
Siga o passo a passo, altamente intuitivo.  
(Use a barra de espaços para selecionar as opções)  

No meu caso:  
1. ✔ JavaScript  
2. To check syntax and find problems  
3. JavaScript modules (import/export)  
4. None of these
5. Does your project use TypeScript? ‣ no / **~~yes~~**  
6. ✔ Node
7. Would you like to install them now? ‣ No / **~~Yes~~**  
8. ▸ npm  

2 - Instale a extensão do Eslint(caso não tenha ainda):  
```sh
code --install-extension dbaeumer.vscode-eslint
```

3 - Para testar, vamos provocar um erro comum, adicionando em **index.ts** uma variável sem usá-la posteriormente
```js
let test = 10; 
```  
Deve aparecer em PROBLEMS:  
'test' is never reassigned. Use 'const' instead.  
'test' is assigned a value but never used.  

4 - Compile:
```sh
npm run compile
```  
* Perceba que agora que também está apontando erro no arquivo index.js da pasta dist.  
Para corrigir crie um arquivo **.eslintignore** contendo:

```ini
# Dist Folder
dist
```  
Compile novamente ou altere qquer coisa no index.js e salve e veja que agora ele está ignorando essa pasta.

5 - Quanto aos erros **'test' is assigned a value but never used.** etc, prefiro que seja apenas um alerta e não um erro.  
Para alterar isso, devemos criar uma sessão de regras no **eslint.config.mjs** criado durante a instalação do Eslint

* Note que os erros foram seguidos dos links para documentação das regras:  
https://eslint.org/docs/latest/rules/prefer-const  
https://typescript-eslint.io/rules/no-unused-vars

A primeira coisa que aparece bem grande nas páginas é **prefer-const** e **no-unused-vars**  
que são justamente o nome das regras, então basta adicionar na seção **rules** e mudar a definição a gosto.  

```js
// ...
export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  // Adicionar aqui, depois de recommended a sessão de regras:
  {
    rules: {
      "prefer-const": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
]);
```

6 - Vamos testar se "pegou" configuração.  

Depois de let test = 10, adicione:
```js
test = 4;
```
O alerta: 'test' is never reassigned. Use 'const' instead, deve desaparecer.

```js
console.log(test);
```
O alerta: 'test' is assigned a value but never used, deve desaparecer.
















