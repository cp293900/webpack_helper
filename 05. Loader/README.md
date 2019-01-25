## Loader

Loader 跟 Plugin 常常會搞不清楚這兩種的差別，Loader 通常是指前置處理檔案，也就是有一些檔案你需要編譯前先做處理的工具，像是常見的 js 、 css 、 圖片都是有各種的 Loader 套件可以做處理。

舉個例，如果 html 的 `<img src="">` src 通常是放圖片的 url，但如果是在本機開發或許沒問題，但一要上傳到 server 時 url 就要變更，當然變更 url 也有套件可以處理，但另一種就是放圖片的 base64 ，這樣就不用管 url 的問題，那這樣的工作手動來做就是要把圖片一張一張算出 base64 在貼到 src ，所以 Loader 在此就可以發揮自動化的功能，可以做到先找到路徑的圖片讀取後取代成 base64，產生新的 html。

### 使用方法
1. 寫在 webpack 設定檔的規則內，在多個 loader 的情形下就是由最下面那個開始執行，所以是依序為 sass-loader 編譯為 css 後，由 css-loader 會把 css 轉成 js，最後由 style-loader 讀取後放進 html 裡，這三個 loader 之後會有詳細解說。
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/, //test 可以用正規表示式或絕對路徑，這裡指找出所有 .css 檔案
                use: [ //use 可以放多個 loader
                        { loader: 'style-loader' }, //使用 style-loader 處理
                        {
                            loader: 'css-loader', //使用 css-loader 處理
                            options: { //options 為 loader 的自訂設定項目
                                modules: true
                            }
                        },
                        { loader: 'sass-loader' } //使用 sass-loader 處理
                ],
                exclude: /node_modules/, //排除的資料夾
            }
        ]
    }
};
```
2. 寫在 import 的位置  
使用 css-loader 與 style-loader 的原因就是希望在 js 內可以 import css 檔案，但是如果只寫 `import './style.css'` ，這樣 webpack 在編譯時根本不懂 css 怎麼 import ，因為它就不是 js 怎麼 import，所以除了第一點的設定檔可以解決外，也可以在 import 字串上加上 loader 來告訴 webpack 這個 import 要先經過 loader 轉換：
```js
//驚嘆號是區隔 loader、問號是設定值，如同網址的 query string
import Styles from 'style-loader!css-loader?modules!./styles.css';

//require 也可以使用
require('babel-loader!./index.js');
```
3. 寫在 command line 執行指令  
也可以下指令，只要加上 `--module-bind`，但後面加的不是說明得很清楚，我測試過後目前是不能加引號，js= 或是 css= 應該是 loader 要讀取的檔案類型，至少下面這個指令確定是可以經過 babel 編譯成功：
```bash
yarn webpack --mode development --devtool none --module-bind js=babel-loader
```

以上 3 個方法，建議使用第一種，比較方便使用跟管理。


