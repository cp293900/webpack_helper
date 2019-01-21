## DevServer

### 簡易 server
大多數的情況需要 server 執行的環境下 javascript 才能正常運行，如 ajax ， webpack 有套件讓我們啟動一個簡單的 server 來跑環境，首先要先安裝套件 [webpack-dev-server](https://webpack.js.org/configuration/dev-server/#src/components/Sidebar/Sidebar.jsx)：
```bash
yarn add webpack-dev-server --dev
```

修改一下 webconfig.config.base
```js
module.exports = {
    ...,
    devServer: {
        //server 會自動偵測路徑有沒有 index.html 作為首頁， 沒有則會以檔案列表形式呈現
        contentBase: [
            path.resolve(__dirname, '../dist'), 
            path.resolve(__dirname, '../views')
        ],
        port: 9000
    }
}
```

執行指令直接把 webpack 改成 webpack-dev-server 就行了，加入 package.json ，然後執行 `yarn run-dev` ， server 在編譯後便會啟動，在瀏覽器輸入 localhost:9000 就會出現畫面：
```json
scripts": {
    ...,
    "run-dev": "webpack-dev-server --config config\\webpack.config.dev.js"
}
``` 

若要停止 server 可以按 `Ctrl` + `C` 停止，以下還有一些常用的設定：
```js
devServer: {
    compress: true,        // 使用 gzip 壓縮
    index: 'index.html',   // 指定首頁
    host: '0.0.0.0',       // 預設是 localhost，設定則可讓外網存取
    open: true,            // 打開瀏覽器
    watchContentBase: true // 啟用 watch
}
```

### 自動編譯
使用 webpack-dev-server `--watch` 要改成 `--watchContentBase` 或是寫進 devServer 屬性裡，啟動 server 後不管編輯 index.html 或是 js 瀏覽器會自動重新整理。

### 結語
由於 webpack 設定檔就是 javascript 所以寫法可以變換多端，目前已經有很多開源可以參考，像是 React 可以做到非常複雜的設定方式，所以這是 webpack 強大且廣泛使用的原因之一。