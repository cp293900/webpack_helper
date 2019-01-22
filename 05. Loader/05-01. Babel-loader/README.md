## Babel-loader

### Babel 解決了什麼
javascript 發展得非常快，普遍常用的是 es5 ，而 es6 在 React 等前端框架開始流行後被廣為使用，很迅速地 es7 es8 會一直出現，但是瀏覽器不一定跟得上，尤其是 IE ， 基本上 es6 都很有問題，在 Babel 出現之前有不少的 pollyfill 的 js 在解決相容性的問題，但現在普遍都使用 Babel 來解決算是一統亂象，簡而言之 Babel 可以將 es6 以上的版本語法轉成 es5，如果你想使用更新的語法 Babel 的設定一定少不了，你可以直接到 [Babel](https://babeljs.io) 首頁看到即時轉譯的結果。

不過 Babel 的功能不僅如此，安裝擴充的套件就能支援 React JSX 語法，也能支援靜態型別檢查的 Flow 語法，所以使用範圍很廣。

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

官方說明說這樣還不能做任何事，需要先安裝 `@babel/preset-env` ，來告訴 Babel 要做怎樣的工作：
```bash
yarn add @babel/preset-env --dev
```

然後新增 .babelrc 設定檔在 root 資料夾中，加入內容：
```json
{
  "presets": ["@babel/preset-env"]
}
```

通常我們稱 preset 為預置處理，可以解釋為準備要處理哪些工作，除了剛剛裝的 [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) ，還有其他的預置處理器，如 [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react) 、 [@babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript) 、 [@babel/preset-flow](https://babeljs.io/docs/en/babel-preset-flow) ， 別忘了 presets 是陣列，所以是可以放入多個預置處理器沒問題，以前有 babel-preset-es2015 / es2016 / es2017 這些預置處理器但最後官方目前推薦使用的是 [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)。

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
es6 的箭頭函示被轉成 es5 的方式了，再測試 IE11 ，使用前會出現語法錯誤，使用後就可以順利印出 log 。

### 更多教學網址
* [Babel 使用手冊](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hant/user-handbook.md)
* [Webpack babel-loader](https://webpack.js.org/loaders/babel-loader/)