## Mocha-loader

[Mocha-loader](https://webpack.js.org/loaders/mocha-loader/#src/components/Sidebar/Sidebar.jsx) 這個官方介紹實在很少，網路也沒什麼 sample ，範例也看不出結果的呈現，所以決定直接來試試看，首先要先確認環境是否已安裝：
* webpack
* webpack-cli
* mocha
* mocah-loader

有 webpack 後先新增一個單元測試用的設定檔：
```js
const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'none',
    entry: './test/test.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'test.js'
    },
    module: {
        rules: [
            {
                loader: 'mocha-loader',
                test: /test\.js$/,
                exclude: /node_modules/
            }
        ]
    }
}
```

然後新增要測試的方法：
```js
// src/average.js
module.exports = function getAverage(arr) {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i]
    }
    return sum / arr.length;
};

// src/max.js
module.exports = function getMax(arr) {
    let max = arr[0]
    for (let i = 0; i < arr.length; i++) {
        max = arr[i] > max ? arr[i] : max
    }
    return max;
};

// src/min.js
module.exports = function getMin(arr) {
    let min = arr[0]
    for (let i = 0; i < arr.length; i++) {
        min = arr[i] < min ? arr[i] : min
    }
    return min
}

// src/app.js
let app = {};

app.getAvg = require('./average');
app.getMin = require('./min');
app.getMax = require('./max');

module.exports = app;
```

再新增測試程式：
```js
// test/test.js
const assert = require('assert');
const app = require('../src/app');

describe('Test', () => {
  it('should return 5', () => {
    assert.equal(app.getAvg([1, 2, 3, 4, 5, 6, 7, 8, 9]), 5);
  });

  it('should return 8', () => {
    assert.equal(app.getMax([3, 8, 5, 7]), 8);
  });

  it('should return 3', () => {
    assert.equal(app.getMin([3, 8, 5, 7]), 5);
  });
})
```

package.json 的 scripts 新增一下：
```json
"scripts": {
    "mocha-loader-test": "yarn webpack --config webpack.config.test.js"
}
```

使用 `yarn mocha-loader-test` 編譯後，會出現 `dist/test.js` 的檔案，看一下檔案內容後，可以發現內容很長，嵌入很多 js ，感覺起來可以嵌在網頁裡跑跑看，所以直接新增一個 `index.html` 把 `test.js` 嵌入後看一下會不會有什麼畫面出現，結果真的測試報告會以網頁的方式呈現：
```html
Test
should return 5 ‣
should return 8 ‣
should return 3 ‣
AssertionError: 3 == 5
    at Context.it (dist/test.js:2416:12)
    at callFn (eval at ./node_modules/script-loader/addScript.js.module.exports (dist/test.js:1005:9), <anonymous>:4550:21)
    at Test.Runnable.run (eval at ./node_modules/script-loader/addScript.js.module.exports (dist/test.js:1005:9), <anonymous>:4542:7)
    at Runner.runTest (eval at ./node_modules/script-loader/addScript.js.module.exports (dist/test.js:1005:9), <anonymous>:5078:10)
    at eval (eval at ./node_modules/script-loader/addScript.js.module.exports (dist/test.js:1005:9), <anonymous>:5196:12)
    at next (eval at ./node_modules/script-loader/addScript.js.module.exports (dist/test.js:1005:9), <anonymous>:4992:14)
    at eval (eval at ./node_modules/script-loader/addScript.js.module.exports (dist/test.js:1005:9), <anonymous>:5002:7)
    at next (eval at ./node_modules/script-loader/addScript.js.module.exports (dist/test.js:1005:9), <anonymous>:4926:14)
    at eval (eval at ./node_modules/script-loader/addScript.js.module.exports (dist/test.js:1005:9), <anonymous>:4970:5)
    at timeslice (eval at ./node_modules/script-loader/addScript.js.module.exports (dist/test.js:1005:9), <anonymous>:82:27)
```

所以說，搞了很久原來這是一個 mocha 的 reporter，提供參考。