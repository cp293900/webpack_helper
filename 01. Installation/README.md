## Webpack 各項配置

### 前言
斷斷續續學習前端技術，學了又忘，忘了再學，相當沒有效率，webpack在各種模組的設定中不一致，所以使用markdown來記錄學習過程。

### 為何使用 webpack
前端開發已經變成相對複雜，很多事情需要自動化，如 scss、less 編譯成 css ，撰寫 es6 但為了瀏覽器要編譯成 es5，或是寫 js library 需要做 minify 等等，故需要一項工具來協助做自動化，而 webpack 是目前最廣泛使用的工具。

### webpack 與 gulp 的選擇
據我觀察 gulp 是最先廣泛使用的工具，後面傳出 gulp 作者不再支援更新的消息，大夥紛紛轉向 webpack ，但也有人說作者也有可能會再更新，但這些不管，目前主流就是 webpack ，在我的觀念裡 gulp 是需要自行寫流程來自動化，而 webpack 是使用設定的方式，對新手而言我認為 gulp 比較容易理解，gulp 與 webpack 也可以共存，但沒有意義，選一種使用就好，不要讓專案複雜化。

#### gulpfile.js 範例
```js
var
    gulp = require('gulp-help')(require('gulp')), //使用gulp
    less = require('gulp-less'); //使用less編譯

    var config = {
        "less": {
            "paths": {
                "source": "./resources/less/**/**.less", //檔案來源
                "output": "./resources/css/" //輸出位置
            }
        }
    }

    //使用gulp做less編譯流程
    var lessTask = () => gulp.src(config.less.paths.source)
        .pipe(less())
        .pipe(gulp.dest(config.less.paths.output));

    //在cmd下只輸入gulp的預設動作
    gulp.task('default', false, [
        'lessTask'
    ]);

    //在cmd下只輸入gulp build-css的動作
    gulp.task('build-css', 'Builds all css from source', lessTask);
```

### 環境安裝
使用 webpack 之前，建議先有一個 IDE 工具，我推薦使用 [vscode](https://code.visualstudio.com/)， 它可以直接輸入 cmd 指令比較方便，如果要使用記事本 + cmd 也是沒有問題，接下來要先安裝 [nodeJS](https://nodejs.org/en/) ，安裝 LTS 長期維護版本即可， nodeJS 會自帶 npm 的工具，所以便可以使用 npm 做安裝套件，接下來安裝 yarn ，你可以把它想成是 npm 的優化指令，基本上 npm 的指令與 yarn 指令相差不大，不使用也無彷。

### 安裝 webpack
1. 先建立一個專案資料夾
2. 開啟 cmd 指向專案資料夾位置  
如果使用 vscode 可以使用快捷鍵 `Ctrl` + `` ` `` 叫出 cmd 視窗
3. 輸入建立專案指令，會產生 package.json
```bash
yarn init //互動式建立
或
yarn init -y //自動建立
```
4. 安裝 webpack 與 webpack-cli 套件，dev 指的是安裝到開發階段的地方，非本專案執行時相依套件，我們只有 build 專案時會用到，不會在執行階段用到
```bash
yarn add webpack webpack-cli --dev
```

### 寫一支 js 做測試
1. 建立 src 資料夾，建立 index.js，打一點 es6 的程式  
#### index.js
```js
let sayHello = () => alert('Hello World!!!');
sayHello();
```
2. 開啟 cmd 輸入編譯指令
```bash
.\node_modules\.bin\webpack
or
npx webpack
or
yarn webpack
```
3. 會發現出現了 dist 的資料夾，裡面已經有編譯成 es5 的 main.js
4. 但我們不喜歡 main.js 的名稱，故我們重下指令
```bash
yarn webpack .\src\index.js -o .\dist\app.js
```
5. 建立 index.html 引用 ./dist/app.js
6. 使用瀏覽器開啟 index.html 可以看到順利跳出的歡迎訊息

### 關於這個專案
1. 你可以建立一個 `.gitignore` 把 node_modules 資料夾排除上傳至版控，因為此資料夾檔案太大了
2. 當其他人要使用專案時只要下指令，指令便會參考 package.json 、 package-lock.json 、 yarn.lock 把需要的 library 建立新的node_modules
```bash
npm install
or
yarn install
```
### webpack 官方教學  
<https://webpack.js.org/guides/getting-started/>

在上方 menu 有分 concepts、configuration、api...
根據使用情境要做不同的設定，甚至排除衝突，所以不是那麼容易上手，
每種 plugin 還有自己的設定方式，需要到該 plugin 的官方查詢。
