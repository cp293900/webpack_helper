## Webpack 設定檔案

### 警告訊息
執行 webpack 指令時，若沒有指定模式就會出現以下的警告訊息：
```bash
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/
```

### 在指令上指定模式
我們可以在指令上加上 --mode 指定警告訊息中可以使用的模式，嘗試以下兩個指令：
``` bash
yarn webpack --mode production
yarn webpack --mode development
```
警告訊息就不再出現了，開啟編譯過的 js 會發現 production 的 js 已經做過 minify，但 development 沒有，所以 development 在開發中方便開發者進行除錯， 等產品完成再使用 production 發佈， 不過我們所寫的 code 在 development 中直接被 eval 包起來，一樣不利於我們除錯，後續再解決。

據說 Webpack4 自帶 UglifyJs ， production 才會有 minify 的功能，但如果要更多的設定一樣還是要安裝 uglifyjs-webpack-plugin 做設定的取代，可閱讀 [从实践中寻找webpack4最优配置](https://segmentfault.com/a/1190000015032321)，但目前可以看到 minify 的結果是可以接受的，連註釋都移除了。

### 以設定指令方式建置
由於每次都要打這麼長的指令，不符合懶人精神，所以要在 package.json 內寫一點東西縮短建置的指令，加入 scripts 的部分，其他的節點說明可以參考 [npm-package.json](https://docs.npmjs.com/files/package.json)
```json
{
  "name": "webpack_helper",
  "scripts": {
    "build-dev": "webpack -o .\\dist\\app.js --mode development",
    "build-prod": "webpack -o .\\dist\\app.min.js --mode production",
    "prebuild": "yarn run build-dev"
  },
  ...
  "devDependencies": {
    ...
  }
}
```
好了，我們就可以下以下指令，就會產生 app.js 與 app.min.js：
```bash
yarn build-dev
yarn build-prod
```
而內部可以使用 run 指令來跑指定 script 如 prebuild 執行後會執行 build-dev 指令，不過目前不支援放多個指令，如有需求可以安裝 npm-run-all 等相關套件來擴充指令能力，這裡也發現一個問題如果取名為 prebuild-dev ，這樣指令名稱跟 build-dev 重疊，在執行 prebuild-dev 時就會開始無限迴圈，須注意。

### 使用 webpack 設定檔建置
這裡算是正式開始接觸 webpack 設定檔，所有的套件通常都會設定再裡面，在 Webpack4 出現後可以開始使用 `yarn webpack init` 來互動式產生設定檔，不過要先裝 `@webpack-cli/init` 套件，以下是互動式問答的過程：
```bash
? Will your application have multiple bundles? (Y/n) Y //要編譯成多個 js 檔案嗎?
? Type the names you want for your modules (entry files), separated by comma [example: app,vendor] app,test //幫你要編譯的多個 js 檔取名 
? What is the location of "app"? [example: ./src/app] ./src/app //app.js 的來源碼在哪
? What is the location of "test"? [example: ./src/test] ./test/test //test.js 的來源碼在哪
? Which folder will your generated bundles be in? [default: dist]: dist //編譯後的app.js & test.js 要放哪個資料夾
? Will you be using ES2015? (Y/n) Y //你使用 es5 嗎
? Will you use one of the below CSS solutions? (Use arrow keys) //你會使用 css 套件嗎
> SASS
  LESS
  CSS
  PostCSS
  No
```
然後就會連幫你該安裝的套件，如 sass 、 babel 安裝好，最後產出 webconfig.dev.js，看一下內容：
```js
const webpack = require('webpack');
const path = require('path');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				include: [path.resolve(__dirname, 'src')],
				loader: 'babel-loader',

				options: {
					plugins: ['syntax-dynamic-import'],

					presets: [
						[
							'@babel/preset-env',
							{
								modules: false
							}
						]
					]
				},

				test: /\.js$/
			},
			{
				test: /\.(scss|css)$/,

				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			}
		]
	},

	entry: {
		app: './src/app.js',
		test: './test/test.js'
	},

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},

	mode: 'development',

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	}
};
```

以上先看過就好，我們要從空白開始且要做點變化型，首先先新增資料夾config，然後在資料夾新增 webpack.config.prod.js、webpack.config.dev.js ，這兩個就是設定檔，然後寫一些基本的東西在裡面：
```js
//webpack.config.dev.js
const path = require('path');
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, '../dist')
    }
};

//webpack.config.prod.js
const path = require('path');
module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'app.min.js',
        path: path.resolve(__dirname, '../dist')
    }
};
```
* mode 應該不用說明了。
* entry 指要編譯的檔案，也可以使用陣列如：
```js
entry: {
    app: './src/index.js',
    utils: ['./src/util-1.js', './src/util-2.js']
}
```
* output 輸出必須使用絕對路徑，所以透過 path 方法來組合絕對路徑，可以透過`[name]`來取得 entry 的別名：
```js
output: {
    filename: '[name].js', //輸出 app.js 與 utils.js
    ...
}
```

這裡要先說明有些語法與套件只屬於 nodeJS ，像是 `require` 方法與 `path` 套件、 `__dirname` 的變數，上面設定很死版，但要記得 javascript 很活，制式的設定可以用更動態的方式來做組合設定，要寫多少程式在裡面無所謂，只要最後 moudule.exports 的東西讓 webpack 看得懂就好。

接下來修改一下 package.json ，將設定指向設定檔，一樣執行指令，就會產生 app.js 與 app.min.js：
```json
"scripts": {
    "build-dev": "webpack --config config\\webpack.config.dev.js",
    "build-prod": "webpack --config config\\webpack.config.prod.js",
    ...
}
```

但是我們不滿足，因為這兩個檔案其實相似度高，應該是可以重構的，沒錯我們就來重構將一樣的部分提出來，首先 config 資料夾新增 webpack.config.base.js 作為上層內容與 webpack.config.dev 一樣：
```js
//webpack.config.base.js
const path = require('path');
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, '../dist')
    }
};
```

最後修改 webpack.config.dev.js 與 webpack.config.prod.js，將 base 引用後使用 Object.assign 方法複製出來修改，或是也可以使用 [webpack-merge](https://github.com/survivejs/webpack-merge) 套件做 config 的合併，一樣執行指令，就會產生 app.js 與 app.min.js：

```js
//webpack.config.dev.js
const webpack_base = require('./webpack.config.base');
const webpack_dev = Object.assign({}, webpack_base);
module.exports = webpack_dev;

//webpack.config.prod.js
const webpack_base = require('./webpack.config.base');
const webpack_prod = Object.assign({}, webpack_base);
webpack_prod.mode = 'production';
webpack_prod.output.filename = 'app.min.js';
module.exports = webpack_prod;
```

### 除錯
先前提到，建置後的 js 會被 webpack 預設使用 eval 包起來，這樣不利於瀏覽器上 debug ， webpack 在設定上提供 [devtool](https://webpack.js.org/configuration/devtool/) 的選項，這裡提之後會用到的參數 none 、 eval 、 source-map 與 cheap-module-source-map，可以修改一下 config ，看編譯後的結果：
```js
module.exports = {
    ...,
    devtool: 'source-map' //或 'cheap-module-source-map'
}
```
* 在 none 的選項，原本的程式碼不會被 eval 包住。
* 在 eval 的選項，為預設選項，程式碼被 eval 包住。
* 在 source-map 的選項可以發現，程式碼沒有變，但會產生 app.js.map 的檔案，使用 chrome 瀏覽器進行除錯時， chrome 會自動偵測到 map 檔案來擷取還原執行的程式碼以利下中斷點。
* 在 cheap-module-source-map 的選項可以發現，原本的程式碼不會被 eval 包住，不過還是會有一個 map 檔案，只是檔案內容更簡短，一樣可以讓 chrome 做對照除錯，但不一樣的是就算沒有 map 檔也是可以除錯，因為原本的程式沒有被 eval 包住。

我的需求最後選擇，dev 使用 none ， prod 使用 cheap-module-source-map，方便進行工作。

### 自動編譯
工程師的一大希望就是當編寫程式時，編譯器如果能邊自動編譯那就好了，瀏覽器最好也能自動刷新，例如寫javascript 或是 css 時可以不用先打指令編譯再按 f5 重新整理瀏覽器，讓作業過程更順暢，而 webpack、gulp 自動化都可以滿足這些功能， webpack 提供了 [watch](https://webpack.js.org/configuration/watch/#src/components/Sidebar/Sidebar.jsx) 的功能，可以打指令或是加進 package.json 裡：
```bash
yarn build-dev --watch // 或 -w
```
可以發現 console 編譯完後並未結束，如果這時候去改 js 就可以看到 console 馬上會自動編譯重新生成 app.js ， 可以按 `Ctrl` + `C` 停止自動編譯的行為。

### 結語
由於 webpack 設定檔就是 javascript 所以寫法可以變換多端，目前已經有很多開源可以參考，像是 React 可以做到非常複雜的設定方式，所以這是 webpack 強大且廣泛使用的原因之一。