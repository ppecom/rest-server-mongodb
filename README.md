#####프로젝트 실행#################
### backend : cd prjroot & yarn dev 
### frontend: cd prjroot/frontend & yarn start 

###프로젝트 생성

cd /drvd/ws
cd react-ex
mkdir blog-fullstack
cd blog-fullstack
yarn init -y
yarn add koa
yarn add koa-router
yarn add koa-bodyparser
yarn add --dev nodemon
yarn add --dev eslint
yarn run eslint --init
yarn add eslint-config-prettier 

vi .eslintrc.json
=====================================
{
  ...
  "extends":["eslint:recommended", "prettier"],
  ...
}
=====================================

mkdir src
vi src/index.js
============src/index.js==================
const Koa = require('koa');

const app = new Koa();

app.use(ctx => {
	ctx.body = 'hello world';
});

app.listen(4000, () => {
	console.log('Listening to port 4000');
});
==========================================

node src ===> src/index.js 실행 

