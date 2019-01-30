## Karma
### 前言
先前提到 forge 是使用 karma + mocha + assert 配置，現在就來談談為何要使用 [karma](https://karma-runner.github.io/latest/index.html)，經過幾番研究發現 karma 並非是一個可以單獨執行的單元測試工具，比較像一個容器，需要很多的套件使它強大，那 karma 能解決什麼樣的問題呢 ? 先前有提到 mocha-loader 其實可以生成一個 js 讓網頁引用便可以渲染出報告，這個網頁就可以使用各瀏覽器開啟看測試報告來知道對瀏覽器的支援度，而 karma 在做的就是很像這類的工具。

### 運行過程
karma 會啟動一個 server ， server 會載入 karma 的設定檔，然後會依據設定檔載入單元測試框架( mocha 或是 jasmine 等等)，再載入要測試的程式、 server 會依據是什麼框架去下測試指令然後出報告，到這裡還看不出 karma 的特色在哪，接下來可以根據設定來決定要測試哪些瀏覽器， server 就會自行開啟瀏覽器，甚至出一個覆蓋測試報告，而這些才是 karma 的特色，但都是要額外安裝套件，所以要讓前端的測試豐富到時麼程度，就要看對套件的了解程度。

### 安裝
```bash
yarn add karma --dev
```

### 啟動
然後可以下指令啟動  `yarn karma start` ，可以看到 console 啟動了 karma server：
```bash
WARN [karma]: No captured browser, open http://localhost:9877/
INFO [karma-server]: Karma v4.0.0 server started at http://0.0.0.0:9877/
```
使用瀏覽器打開 `http://localhost:9877/` 可以看到標題 karma vX.X.X -connected，表示 sever 已經起來了 ( Ctrl + c 可以結束)，但是看一下 console ：
```bash
Chrome 71.0.3578 (Windows 8.1.0.0) ERROR
{
    "message": "You need to include some adapter that implements __karma__.start method!",
    "str": "You need to include some adapter that implements __karma__.start method!"
}
```
因為我是使用 chrome 打開頁面，它提示我需要一些轉接器去讓 `__karma__.start` 這個方法有實作的內容，簡單來說就是要再裝一些套件。

### 初始化設定
在處理其它套件前，我先新增一下 karma 的設定檔，先裝套件還是先處理設定檔順序都可以，但通常像 webpack 也是先做設定檔再裝套件， karma 可以用 init 做互動式設定，所以直接打 `yarn karma init`：
```bash
//要選什麼測試框架，我使用 mocha
Which testing framework do you want to use ?
Press tab to list possible options. Enter to move to the next question.
> mocha

//目前不會用到 Require.js
Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
> no

//要使用什麼瀏覽器做測試 ? 先只使用 chrome
Do you want to capture any browsers automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
> Chrome
>

//指定原程式與測試程式
What is the location of your source and test files ?
You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
Enter empty string to move to the next question.
> src/*.js
28 01 2019 16:10:42.842:WARN [init]: There is no file matching this pattern.

> test/*.js
28 01 2019 16:10:50.688:WARN [init]: There is no file matching this pattern.

>

//是否應排除先前模式包含的任何文件
Should any of the files included by the previous patterns be excluded ?
You can use glob patterns, eg. "**/*.swp".
Enter empty string to move to the next question.
>

//是否要監控程式是否有變化
Do you want Karma to watch all the files and run the tests on change ?
Press tab to list possible options.
> yes

//根據上述回答製作了 karma.conf.js
Config file generated at "C:\Users\user\Desktop\project\webpack_helper\06. Unit Test\06-02. Karma\karma.conf.js".
```

設定檔完成後看一下 package.json ，可以發現多裝了兩個東西(karma-mocha、karma-chrome-launcher)，看起來是給 mocha 跟 chrome 用的，但我們要未雨綢繆，之後如果想要擴充的話要自己來，所以要先看看沒裝的話會發生麼事，所以先把這兩個給移除。

### 加入測試程式
新增 src 的資料夾，加入計算陣列最大值的程式 max.js :
```js
module.exports = function getMax(arr) {
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
        max = arr[i] > max ? arr[i] : max;
    }
    return max;
};
```

新增 test 的資料夾，加入單元測試項目的程式 test.js :
```js
const assert = require('assert');
const getMax = require('../src/max');

describe('Test', () => {
    it('should return 8', () => {
    assert.equal(getMax([3, 8, 5, 7]), 8);
    });

    it('should return 10', () => {
    assert.equal(getMax([3, 8, 5, 10]), 8);
    });
})
```

執行 `yarn karma start` ，第一個發現的錯誤是，沒有安裝 mocha 的框架：
```bash
ERROR [karma-server]: Server start failed on port 9876: Error: No provider for "framework:mocha"! (Resolving: framework:mocha)
error Command failed with exit code 1.
```

### Karma framework
上述有提到，沒有安裝 mocha 的 framework，這個錯誤並不是指你沒有安裝 mocha，而是你沒有安裝給 karma 用的 mocha 框架，而框架的取名都是 karma-* 的模式，可以參考官網 [Developing Plugins](https://karma-runner.github.io/3.0/dev/plugins.html) 。

### 安裝 karma-mocha
所以當前我們需要安裝的是  [karma-mocha](https://github.com/karma-runner/karma-mocha) ，這作者是 karma，所以看起來反而是 karma 主動想去支援 mocha 做的，反正先進行指令安裝：
```bash
yarn add karma-mocha --dev
```
再執行 `yarn karma start`，出現另一個錯誤：
```bash
ERROR [karma-server]: Server start failed on port 9876: Error: Cannot find module 'mocha'
```

### 安裝 mocha
上述這錯誤就跟框架不同了，很明白的指出它找不到 mocha 這個模組，所以要先安裝 mocha :
```bash
yarn add mocha --dev
```

再執行 `yarn karma start`，一樣還是爆掉，來看看是什麼錯誤：
```bash
INFO [launcher]: Launching browsers Chrome with concurrency unlimited
ERROR [launcher]: Cannot load browser "Chrome": it is not registered! Perhaps you are missing some plugin?
ERROR [karma-server]: Error: Found 1 load error
    at Server.webServer.listen (C:\Users\user\Desktop\project\webpack_helper\06. Unit Test\06-02. Karma\node_modules\karma\lib\server.js:182:27)
    at Object.onceWrapper (events.js:313:30)
    at emitNone (events.js:111:20)
    at Server.emit (events.js:208:7)
    at emitListeningNT (net.js:1387:10)
    at _combinedTickCallback (internal/process/next_tick.js:136:11)
    at process._tickCallback (internal/process/next_tick.js:181:9)
```

### Karma browsers
上述錯誤提到，無法讀取設定檔內 browsers 陣列內 Chrome 這個瀏覽器，是不是沒有安裝什麼套件導致沒有註冊，這裡可以看官網的 [Browsers](https://karma-runner.github.io/3.0/config/browsers.html) 這個地方有說明需要安裝一些套件才能使用你指定的 browser 。
 
### 安裝 karma-chrome-launcher
所以第二需要安裝的是  [karma-chrome-launcher](https://github.com/karma-runner/karma-chrome-launcher) ，這作者也是 karma，進行指令安裝：
```bash
yarn add karma-chrome-launcher --dev
```

再執行 `yarn karma start`，直接出現了瀏覽器的視窗，看起來應該是 chrome 的瀏覽器，不過 console 仍然出現錯誤：
```bash
Chrome 71.0.3578 (Windows 8.1.0.0) ERROR
{
    "message": "Uncaught ReferenceError: module is not defined\nat src/max.js:1:1\n\nReferenceError: module is not defined\n    at src/max.js:1:1",
    "str": "Uncaught ReferenceError: module is not defined\nat src/max.js:1:1\n\nReferenceError: module is not defined\n    at src/max.js:1:1"
}

Chrome 71.0.3578 (Windows 8.1.0.0) ERROR
{
    "message": "Uncaught ReferenceError: require is not defined\nat test/test.js:1:16\n\nReferenceError: require is not defined\n    at test/test.js:1:16",
    "str": "Uncaught ReferenceError: require is not defined\nat test/test.js:1:16\n\nReferenceError: require is not defined\n    at test/test.js:1:16"
}
```

這個錯誤的意思是，它看不懂 module.exports 跟 require 的語法，為什麼看不懂 ? 因為之前都是 webpack 來編譯的阿，所以說這裡出現要跟 webpack 結合的契機了。

### 安裝 karma-webpack
根據上述線索搜尋看看有沒有 karma-webpack 或是 webpack-karma ，果不其然真的有 [karma-webpack](https://webpack.js.org/guides/integrations/#karma)，由 webpack 所提供的，所以第三方支援套件很有趣的是，都在互相替對方做支援，但這也是麻煩，要弄清楚這作者是哪邊做的，進行指令安裝：
```bash
yarn add webpack webpack-cli --dev //當然要先有 webpack
yarn add karma-webpack --dev
```

安裝好後，要跟 karma 說執行前要先經過 webpack 的編譯，所以在 karma.conf.js 加上預處理器設定：
```js
module.exports = function(config) {
  config.set({
        ...,
        preprocessors: {
            'src/*.js': [ 'webpack' ],
            'test/*.js': [ 'webpack' ]
        },
        
        webpack: {
            //設定方式就跟之前的 webpack 一樣，不設定就是 webpack 的預設
        },
        ...
  })
}
```

再執行一次 `yarn karma start` 出現下列訊息：
```bash
Chrome 71.0.3578 (Windows 8.1.0.0) Test should return 10 FAILED
        AssertionError: 10 == 8
            at Context.it (test/test.js:1:1208)
Chrome 71.0.3578 (Windows 8.1.0.0): Executed 2 of 2 (1 FAILED) (0.015 secs / 0.004 secs)
TOTAL: 1 FAILED, 1 SUCCESS
```
一個失敗，一個成功是預期的結果，所以看起來編譯已經沒問題了。

### Debug
當我們發現單元測試有誤時，應該要如何偵錯， karma 啟動瀏覽器時，標題列有個 debug 的按鈕，按下去後會顯示空白頁，`右鍵 -> 檢查` 查看原始碼。
* 在 `Console` 的標籤可以看到測試的 log 訊息，對這個頁面重新整理就會再執行一次檢查，所以可以利用這個機制來做中斷點檢查。
* 在 `Sources` 的標籤中左邊可以看到有 `base` 的資料夾，裡面就放有 max.js 、 test.js 的程式碼，不過打開後會發現程式碼已經經過 minify (因為 webpack 預設 mode 是 production，你也可以設成 development)，所以我們需要 source map 來協助 debug ， 所以要先設定 karma.conf.js 的 webpack 項目，然後重啟 server：
```js
module.exports = function(config) {
  config.set({
        ...,
        webpack: {
            //mode: 'development',
            devtool: 'inline-source-map'
        }
        ...
  })
}
```
推薦是使用 `inline-source-map` ，這會在 `Sources` 的標籤出現 `webpack://` 的分類，找一下裡面有個 src 的資料夾就有未 minify 的原始碼，就可以拿來下中斷點偵錯。

### 其他瀏覽器測試
* Firefox  
先安裝 `karma-firefox-launcher` (當然前提是電腦也要有 firefox):
```bash
yarn add karma-firefox-launcher --dev
```
然後設定 karma.conf.js ，新增 firefox:
```js
module.exports = function(config) {
  config.set({
        ...,
        browsers: ['Chrome', 'Firefox'],
        ...
  })
}
```
啟動 server 後，會自動開啟，所以時間會更長一些。

* Internet Explore (IE)  
先安裝 `karma-ie-launcher`
```bash
yarn add karma-ie-launcher --dev
```
然後設定 karma.conf.js ，新增 firefox:
```js
module.exports = function(config) {
  config.set({
        ...,
        browsers: ['Chrome', 'Firefox', 'IE'],
        ...
  })
}
```
啟動 server 後，等到 IE 被開啟後就會出現新的錯誤：
```bash
IE 11.0.0 (Windows 8.1.0.0) ERROR
{
    "message": "語法錯誤\nat test/test.js:1:1022",
    "str": "語法錯誤\nat test/test.js:1:1022"
}
```
這是因為沒有將程式碼轉譯成 es5 ，所以 ie 當然看不懂，而 chrome 、 firefox 多少會一些 es6 的語法所以結果是可預期的，這個問題稍後再解決。

IE 一直以來是前端萬惡的根源，尤其是做 ie8 、 ie9 相容性測試，所以這個套件也提供設定：
```js
module.exports = function(config) {
  config.set({
        ...,
        browsers: ['IE9', 'IE8'],
        customLaunchers: {
            IE9: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE9'
            },
            IE8: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE8'
            }
        }
        ...
  })
}
```

* Edge、Safari  
這兩種也是常見的瀏覽器，礙於我電腦是 windows 8，所以都沒有，請自行測試。

* PhantomJS  
最後要說這個 [PhantomJS](http://phantomjs.org/) ，官網的介紹說這是一個沒有介面的瀏覽器，可以在 windows 、 mac 、 linux 上執行，使用的核心是 QtWebKit，它有一些功能可以使用，像是網頁截圖，而我們用到的則是 [Headless Testing with PhantomJS](http://phantomjs.org/headless-testing.html) 也就是無瀏覽器測試，它可以加快基本的測試，因為不用等待開啟瀏覽器的時間，不過保險一點最後還是要做多瀏覽器測試，因為 firefox 、 edge 、 ie 的核心引擎不是 webkit ，難保不會發生什麼問題，一樣先安裝 `karma-phantomjs-launcher` :
```bash
yarn add karma-phantomjs-launcher --dev
```
然後設定 karma.conf.js 只剩 firefox:
```js
module.exports = function(config) {
  config.set({
        ...,
        browsers: ['PhantomJS'],
        ...
  })
}
```
啟動 server 後，出現錯誤：
```bash
PhantomJS 2.1.1 (Windows 8.0.0) ERROR
{
    "message": "SyntaxError: Expected an identifier but found 'max' instead\nat src/max.js:2:0",
    "str": "SyntaxError: Expected an identifier but found 'max' instead\nat src/max.js:2:0"
}

PhantomJS 2.1.1 (Windows 8.0.0) ERROR
{
    "message": "SyntaxError: Unexpected token ')'\nat test/test.js:4:0",
    "str": "SyntaxError: Unexpected token ')'\nat test/test.js:4:0"
}
```
看起來 PhantomJS 也不吃 es6 的語法，所以我們要用 Babel 轉成 es5 來改善這個問題。

### 使用 Babel
1. webpack + babel-loader  
在 Loader 的章節裡有提到怎麼使用 Babel，所以照著教學安裝好 `babel-loader` 、 `@babel/core` 、 `@babel/preset-env` ，新增並設定 `.babelrc` ，接下來把 loader 的規則寫到 karma.conf.js:
```js
module.exports = function(config) {
  config.set({
        ...,
        webpack: {
            mode: 'development',
            devtool: 'inline-source-map',
            module: {
                rules: [
                    { 
                        loader: "babel-loader",
                        test: /\.js$/,
                        exclude: /node_modules/ 
                    }
                ]
            }
        },
        ...
  })
}
```
然後啟用 server ，果然測試正常了，也可以發現 PhantomJS 不會出現瀏覽器的視窗，查看測試結果比較快，再換成 IE 試試看，也沒有語法錯誤的問題了。

2. karma-babel-preprocessor (暫不使用)  
不過 Babel 的官網的設定頁面上有提供給 karma 的額外[設定方式](https://babeljs.io/setup#installation)， Babel 提供了 karma 用的預處理器的套件，所以將時光倒帶到尚未安裝 babel 的時候，然後安裝 [karma-babel-preprocessor](https://github.com/babel/karma-babel-preprocessor):
```bash
yarn add karma-babel-preprocessor --dev
```

照著官網的設定 karma.conf.js，先把 webpack 換成 babel:
```js
module.exports = function(config) {
  config.set({
        ...,
        preprocessors: {
            'src/*.js': [ 'babel' ],
            'test/*.js': [ 'babel' ]
        },

        // 暫不使用
        // webpack: {
        //   mode: 'development',
        //   devtool: 'inline-source-map',
        //   module: {
        //     rules: [
        //         { 
        //             loader: "babel-loader",
        //             test: /\.js$/,
        //             exclude: /node_modules/
        //         }
        //     ]
        //   }
        // },
        ...
  })
}
```

接下來一樣要安裝 `@babel/preset-env` 跟設定 `.babelrc` ，這邊不多寫說明，然後啟動 server 試試看，結果發現錯誤：
```bash
ERROR [preprocess]: Can not load "babel", it is not registered!
  Perhaps you are missing some plugin?
```

結果避免不了還是要安裝 `@babel/core`，安裝一下再試試看，結果還是一樣語法發生錯誤，使用 chrome 偵錯一下，看起來已經編譯成 es5 了，唯有兩個沒有就是 module.exports 跟 require ，這是 commonJS 的語法， barbel 似乎沒辦法處理，這時我才在 [karma-babel-preprocessor](https://github.com/babel/karma-babel-preprocessor) 上看到前言的簡介：

> babel and karma-babel-preprocessor only convert ES6 modules to CommonJS/AMD/SystemJS/UMD. If you choose CommonJS, you still need to resolve and concatenate CommonJS modules on your own. We recommend karma-browserify + babelify or webpack + babel-loader in such cases.

簡而言之是說如果你有用到 commonJS ， 那建議你去用 webpack + babel-loader 的組合啦，所以就這樣被打回去了，所以說如果你要用 [karma-babel-preprocessor](https://github.com/babel/karma-babel-preprocessor) ，你要完全使用 es6 的語法 ， 也等於是說斷言你就必須放棄 nodeJS 的 assert 改用 chai 等其它的斷言庫，以後再來研究有沒有其它解套方式，所以還是改回第一種 webpack + babel-loader 。

### 代碼覆蓋率
這部分的知識目前不是很了解，可以看一下維基百科 [代碼覆蓋率](https://zh.wikipedia.org/wiki/%E4%BB%A3%E7%A2%BC%E8%A6%86%E8%93%8B%E7%8E%87) 的解釋，可以利用這個報告提供給客戶說明程式碼是有一定的可靠度， karma 有提供套件 [karma-coverage](https://github.com/karma-runner/karma-coverage) ，它會使用 [istanbul](http://gotwarlost.github.io/istanbul/) 來產生程式碼覆蓋率， [istanbul](http://gotwarlost.github.io/istanbul/) 是什麼東西我也不懂， 看標題就直接明講是一個專門為 javascript 做的程式碼覆蓋率的工具，直接來安裝用用看 :
```bash
yarn add karma-coverage --dev
```

設定 karma.conf.js ， reporters 要加上去，預處理器也要加上去，不過要注意的是加的不是 test ，因為不需知道測試碼的覆蓋率：
```js
module.exports = function(config) {
  config.set({
        ...,
        preprocessors: {
            'src/*.js': [ 'webpack', 'coverage' ],
            'test/*.js': [ 'webpack' ]
        },
        reporters: ['progress', 'coverage'],
        ...
  })
}
```

這樣就完成了，然後啟動 server 後會發現產生了 coverage 的資料夾，裡面有個 index.html 用瀏覽器打開來看看，它已經將報告做成網頁給你了，是不是相當的專業。