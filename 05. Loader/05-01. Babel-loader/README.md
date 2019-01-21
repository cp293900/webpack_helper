## Babel-loader

### Babel 解決了什麼
javascript 發展得非常快，普遍常用的是 es5 ，React 開始用 es6 開始被廣為使用，很迅速地 es7 es8 會一直出現，但是瀏覽器不一定跟得上，尤其是 IE ， 基本上 es6 都很有問題，在 Babel 出現之前有不少的 pollyfill 的 js 在解決相容性的問題，但現在普遍都使用 Babel 來解決算是一統亂象，簡而言之 Babel 可以將 es6 以上的版本語法轉成 es5，如果你想使用更新的語法 Babel 的設定一定少不了，你可以直接到 [Babel](https://babeljs.io) 首頁看到即時轉譯的結果。

### 如何使用
Babel 使用的方式好幾種，在官網的 [Setup](https://babeljs.io/setup) 提供了各種框架使用方式，最單純的就是直接下載 Prototyping in the browser 的 js 然後引用到 html 裡面就可以在該 html 底下寫 es6 的語法了。

不過我們要使用的是 webpack 框架，所以在官網的指示中需要先下指令安裝 babel-loader：
```bash
yarn add babel-loader @babel/core --dev
```

修改 webconfig.config.base 加入 module 規則：
```js
module.exports = {
    ...,
    module: {
        rules: [
            { 
                loader: "babel-loader", //指定讀取器
                test: /\.js$/,          // 尋找所有 js 檔案
                exclude: /node_modules/ // 排除 node_modules 內所有檔案
            }
        ]
    }
}
```

官方說明說這樣還不能做任何事，需要先安裝 `@babel/preset-env` ，先跟著安裝，之後再了解為什麼：
```bash
yarn add @babel/preset-env --dev
```

然後新增 .babelrc 設定檔在 root 資料夾中，加入一點內容：
```json
{
  "presets": ["@babel/preset-env"]
}
```

最後執行 build-dev 看看 app.js 的 sayHello 變化：
```js
//使用前
let sayHello = (name) => {
    console.log('Hello ' + name);
};

//使用後
var sayHello = function sayHello(name) {
  console.log('Hello ' + name);
};
```
es6 的箭頭函示被轉成 es5 的方式了。