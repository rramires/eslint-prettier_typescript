# eslint-prettier-for-typescript

#### Eslint + Prettier setup without headaches and conflicts

### Instalação e configuração do TypeScript

- Caso já tenha feito isso, pule direto para a segunda parte, instalação do Eslint + Prettier

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
		"moduleResolution": "node16",
		"target": "ES2023"
	}
}
```

5 - Crie a pasta **src** e **index.ts** dentro com um simples console.log:

```js
const lang = 'TypeScript'

console.log(`Hello World from ${lang}!`)
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

### Instalação e configuração do Eslint

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
let test = 10
```

Deve aparecer em PROBLEMS:  
'test' is never reassigned. Use 'const' instead.  
'test' is assigned a value but never used.

4 - Compile:

```sh
npm run compile
```

- Perceba que agora que também está apontando erro no arquivo index.js da pasta dist.  
  Para corrigir crie uma regra **ignores: ["dist/*"]** no **defineConfig** em **eslint.config.mjs**:

```js
// ...
export default defineConfig([
	// Adicionar aqui
	{ ignores: ['dist/*'] },
	//
	{ files: ['**/*.{js,mjs,cjs,ts}'], plugins: { js }, extends: ['js/recommended'] },
	{ files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: globals.node } },
	tseslint.configs.recommended,
])
```

- Nesse local (ignores:[...]) agora é possível adicionar mais pastas ou arquivos para serem ignorados pelo Eslint, caso necessário.
- Funciona ainda adicionar um **.eslintignore**, mas está em classificado como **deprecated**, então melhor a solução nova, acima descrita.
- Perceba que foi gerado na instalação o **eslint.config.mjs**, que é a versão mais nova do aquivo de configuração, pois os **.eslintrc.\*** , não são mais compatíveis.

Compile novamente ou altere qquer coisa no index.js e salve e veja que agora ele está ignorando essa pasta.

5 - Quanto aos erros **'test' is assigned a value but never used.** etc, prefiro que seja apenas um alerta e não um erro.  
Para alterar isso, devemos criar uma sessão de regras no **eslint.config.mjs** criado durante a instalação do Eslint

- Note que os erros foram seguidos dos links para documentação das regras:  
  https://eslint.org/docs/latest/rules/prefer-const  
  https://typescript-eslint.io/rules/no-unused-vars

A primeira coisa que aparece bem grande nas páginas é **prefer-const** e **no-unused-vars**  
que são justamente o nome das regras, então basta adicionar na seção **rules** e mudar a definição a gosto.

```js
// ...
export default defineConfig([
	{ files: ['**/*.{js,mjs,cjs,ts}'], plugins: { js }, extends: ['js/recommended'] },
	{ files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: globals.node } },
	tseslint.configs.recommended,
	// Adicionar aqui, depois de recommended a sessão de regras:
	{
		rules: {
			'prefer-const': 'warn',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	},
	//
])
```

6 - Vamos testar se "pegou" a configuração:

Troque o const por let no index.ts:

```js
let test = 10
```

O alerta: 'test' is never reassigned. Use 'const' instead, deve desaparecer.

Depois de let test = 10, adicione:

```js
test = 4
```

E então:

```js
console.log(test)
```

O alerta: 'test' is assigned a value but never used, deve desaparecer.

7 - Caso necessite, crie os comandos na sessão de **scripts** do **package.json**:

```json
"scripts": {
  "lint": "eslint . --ext .ts",
  "lint:fix": "eslint . --ext .ts --fix"
}
```

8 - Para testar, experimente deixar novamente somente o let test = 10; no index.ts para voltar os erros e execute:

```sh
npm run lint
```

Veja os dois erros, agora no terminal

Para que ele tente corrigir:

```sh
npm run lint:fix
```

Perceba que ele trocou o let por const:

```js
const test = 10
```

- Mas o alerta da variável não ter sido usada, continua. E isso o **--fix** no comando não vai resolver.

Uma maneira de remover a checagem de uma linha espeçifica, que vc tem certeza que vai usar mais tarde é usar como comentário // eslint-disable-next-line. Adicione e veja remover o warning:

```js
// eslint-disable-next-line
const test = 10
```

Para remover a checagem de um arquivo inteiro, adicione no início dele:

```js
/* eslint-disable */
```

Ou um trecho:

```js
/* eslint-disable */
alert('foo')
/* eslint-enable */
```

Veja mais na documentação:  
[Configure Rules](https://eslint.org/docs/latest/use/configure/rules)

---

### Instação e configuração do Prettier

- Na versão mais nova do Eslint, não é mais papel dele verificar estilos. Se usa tab ou espaços para indentação, se tem ou não ponto e vírgula, aspas simples ou duplas, etc.  
  Por isso não tem mais as opções de escolher os modelos do Airbnb, Google, etc  
  Para isso, daqui pra frente devemos usar o Prettier para formatação do código.

1 - Instale o Prettier:  
[Installt Prettier](https://prettier.io/docs/install)

```sh
npm install --save-dev --save-exact prettier
```

2 - Crie o arquivo de exclusão **.prettierignore** e adicione:  
[Ignoring Code](https://prettier.io/docs/ignore)

```ini
# Dist Folder
dist
```

3 - Crie o arquivo de configuração do Prettier, **.prettierrc.json** contendo:  
[Prettier Options](https://prettier.io/docs/options)

- Minha configuração:  
  **printWidth=100** - Largura máxima de uma linha (quebra após passar)  
  **endOfLine="lf"** - Quebra de linha, "lf" padrão unix  
  **singleQuote=true** - Aspas simples  
  **quoteProps="as-needed"** - Usa aspas nas propriedases, só quando necessário
  **semi=false** - Sem ponto e virgula  
  **useTabs=true** - Usar tabs em vez de espaços para indentação  
  **tabWidth=4** - Tab equvalente a 4 espaços  
  **arrowParens="always"** - Sempre usa parenteses nas Arrow Functions

```json
{
	"printWidth": 100,
	"endOfLine": "lf",
	"singleQuote": true,
	"quoteProps": "as-needed",
	"semi": false,
	"useTabs": true,
	"tabWidth": 4,
	"arrowParens": "always"
}
```

4 - Instale a extensão do Prettier(caso não tenha ainda):

```sh
code --install-extension esbenp.prettier-vscode
```

5 - Para que funcione ao salvar o arquivo no **settings.json** do VScode tem que adicionar o Prettier como defaultFormatter. Também gosto de usar o autoSave.

- Para abrir, use o ctrl+shift+p, digite **settings.json**, selecione e adicione no final:

```json
"files.autoSave": "afterDelay",
"[typescript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```

Vá no **index.ts** e salve. Devem sumir os ponto e vírgulas, as aspas devem mudar pra simples, etc

6 - Caso queira, crie os comandos na sessão de **scripts** do **package.json**:

```json
"scripts": {
  "check": "prettier --check \"src/**/*.ts\"",
  "format": "prettier --write \"src/**/*.ts\""
}
```

Testando. Vá no **index.ts** e volte aspas duplas e ponto e vírgula.

Verificar:

```sh
npm run check
```

Corrigir:

```sh
npm run format
```

---

### Garantindo que não vai ter conflito entre o Eslint e o Prettier.

- Aqui que vem a grande sacada para que as duas extensões e pacotes não conflitem e fique um anulando alguma coisa que o outro modificou:  
  [Integrating with Linters](https://prettier.io/docs/integrating-with-linters)

1 - Vendo a documentação acima, vamos instalar o pacote **eslint-config-prettier**:  
[Eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)

```sh
npm i -D eslint-config-prettier
```

2 - No arquivo de configuração do Eslint, importe e adicione por último o **eslintConfigPrettier**:

```js
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
// Importe
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
	{ ignores: ['dist/*'] },
	{ files: ['**/*.{js,mjs,cjs,ts}'], plugins: { js }, extends: ['js/recommended'] },
	{ files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: globals.node } },
	tseslint.configs.recommended,
	{
		rules: {
			'prefer-const': 'warn',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	},
	// Adicione
	eslintConfigPrettier,
])
```
