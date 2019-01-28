## Mocha

### 前言
說到單元測試，之前是寫 .net C#，單元測試已經有內建可以使用，也可以使用 NUnit 套件使用，基本上不會煩惱有太多的選擇，使用上也不是很困難，根本不用設定什麼，可能也是用的不深。  
但最近因為要開始提供客戶 api 的關係，剛好看到我要使用的 forge library 也有做單元測試，想說來研究一下怎麼使用，然後才發現前端設計的單元測試設定一點都不容易， forge 採用的是 karma + mocha + assert ，然後開始無止盡的 google ，為什麼一個單元測試無法一個套件就解決，而在查詢途中會出現非常多種的單元測試組合。

[JavaScript 單元測試框架：Jasmine, Mocha, AVA, Tape 和 Jest 的比較](https://hk.saowen.com/a/4287ca612e97bddee82b5aa8477ecb022c9762c3295f4383c7c34a33bda6b16a)

看了大部分的搜尋標題，可以看到 jasmine 與 mocha 似乎比較主流，而 mocha 要自己掌控的工作似乎更多，但不管，目前至少有 forge 可以參考，就先測試 mocha ，而 karma 跟 assert 是什麼之後遇到再說。

### TDD vs BDD
很多文章很囉唆的都會提到這兩個差異，所以我也把這個表格貼出來：
### 
|  　　     |         TDD            |     BDD        |
| :-------: | :-------------------: | :-------------: |
|    全名    | 測試驅動開發 Test-Driven Development | 行為驅動開發 Behavior Driven Development |
|    定義    | 藉由先定義規格， 再撰寫程式的方式來開發軟體， 概念是以通過測試來推動整個開發的進行。| 繼承 TDD 以使用者導向下去做測試， 並且有一份正確的規格下去做驗證。|
|    特性    | 從測試去思考程式如何實作。 強調小步前進、快速且持續回饋、擁抱變化、重視溝通、滿足需求。| 從用戶的需求出發，強調系統行為。 使用自然語言描述測試案例 ，以減少使用者和工程師的溝通成本。 測試後的輸出結果可以直接做為文件閱讀。|

來源：
* [[Day-36]使用mocha來做單元測試](https://ithelp.ithome.com.tw/articles/10197286)
* [單元測試：Mocha、Chai 和 Sinon](https://cythilya.github.io/2017/09/17/unit-test-with-mocha-chai-and-sinon/)

#### BDD
在 mocha 的介紹中，指出 BDD 是個介面，它提供以下方法：
* `describe()`：描述場景或圈出特定區塊，例如：標明測試的功能或 function。
* `context()`:與 `describe()` 行為相同，只是讓組織閱讀更容易。
* `it()`：撰寫測試案例（Test Case）。
* `specify()`:與 `it()` 行為相同，只是讓組織閱讀更容易。
* `before()`：在所有測試開始前會執行的程式碼區塊。
* `after()`：在所有測試結束後會執行的程式碼區塊。
* `beforeEach()`：在每個 Test Case 開始前執行的程式碼區塊。
* `afterEach()`：在每個 Test Case 結束後執行的程式碼區塊。

使用 mocha 這個範例來寫測試來符合 BDD 的要求，組合起來就會像這樣：
```js
describe('Array', function() {
    before(function() {
        // 在所有測試開始前會執行的程式碼區塊
    });

    after(function() {
        // 在所有測試結束後會執行的程式碼區塊
    });

    beforeEach(function() {
        // 在每個 Test Case 開始前執行的程式碼區塊
    });

    afterEach(function() {
        // 在每個 Test Case 結束後執行的程式碼區塊
    });

    describe('#indexOf()', function() {
        context('when not present', function() {
            it('should not throw an error', function() {
                (function() {
                    [1,2,3].indexOf(4);
                }).should.not.throw();
            });
            it('should return -1', function() {
                [1,2,3].indexOf(4).should.equal(-1);
            });
        });

        context('when present', function() {
            it('should return the index where the element first appears in the array', function() {
                [1,2,3].indexOf(3).should.equal(2);
            });
        });
    });
});
```
#### TDD
在 mocha 的介紹中，指出 TDD 也是個介面，它提供以下方法：
* `suite()`：描述場景或圈出特定區塊，例如：標明測試的功能或 function。
* `test()`：撰寫測試案例（Test Case）。
* `suiteSetup()`:還不知道是什麼。
* `suiteTeardown()`：還不知道是什麼。
* `setup()`：還不知道是什麼。
* `teardown()`：還不知道是什麼。

使用 mocha 這個範例來寫測試來符合 BDD 的要求，組合起來就會像這樣：
```js
suite('Array', function() {
    setup(function() {
        // ...
    });

    suite('#indexOf()', function() {
        test('should return -1 when not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});
```

### 安裝
首先為了先了解 [mocha](https://mochajs.org/) ，所以先不挑戰結合 webpack ，先單純的只安裝 mocha 讓測試順利跑一遍，再來想想為什麼要結合 webpack：
```bash
yarn add mocha --dev
```

### 測試
我們跟著 mocha 的 getting started 跑一遍，先建立一個 test 的資料夾，然後再建立 test.js ，在裡面加入內容：
```js
var assert = require('assert');
describe('Array', function() { //Array只是文字標題，讓開發者知道這是測試Array項目
    describe('#indexOf()', function() {  //#indexOf()只是文字標題，讓開發者知道這是測試indexOf()的功能
        it('should return -1 when the value is not present', function() { //test case 的描述指出 -> 如果值不在陣列裡面，那這個 case 應該要回傳 -1
            assert.equal([1,2,3].indexOf(4), -1);
        });
    });
});
```

然後下指令：
```bash
yarn mocha .\test\test.js
```

可以看到結果為：
```bash
  Array
    #indexOf()
      √ should return -1 when the value is not present


  1 passing (15ms)

Done in 0.95s.
```

看來是通過了，感覺其實不難，可以看到描述是用來顯示在 console 上的，這樣開發者不用再去翻 code，如果把值從 4 改成 3 試試，這樣測試的結果就會是 2 不是 -1 ，所以測試失敗：
```bash
 Array
    #indexOf()
      1) should return -1 when the value is not present

  0 passing (18ms)
  1 failing

  1) Array
       #indexOf()
         should return -1 when the value is not present:

      AssertionError [ERR_ASSERTION]: 2 == -1
      + expected - actual

      -2
      +-1

      at Context.<anonymous> (test\test.js:5:14)

error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

### Assert
我們回到程式碼看到第一行 `var assert = require('assert');` ，為什麼我們需要引用這個東西，在單元測試中有個常見的詞 assert ，中文則翻成斷言，聽起來很奇怪，看了一些文章後才明白 assert 指的是最後判斷結果的方法，我真是沒想到連這個小地方也有套件可以做擴充，常用的套件有：  
* nodeJS 內建的 assert
* [chai.js](https://www.chaijs.com/)
* [should.js](https://shouldjs.github.io/)
* [expect.js](https://github.com/Automattic/expect.js/)

再看到之前比較的文章中， mocha 與 jasmine 有一點的差別在於 jasmine 無法擴充 assert 的方法，它有自己內建的 assert ，所以如果崇尚自由的話就還是選擇 mocha。

然後 forge 也只有使用內建的 assert 我目前就先不節外生枝做這些斷言庫的研究，到目前我們已經知道 forge 的 mocha + assert 的組合是怎麼一回事了。

### 結合 webpack
安裝 webpack 、 webpack-cli 後，加入 webpack.config.test.js：
```js
const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'none',
    entry: './test/test.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'test.js'
    }
}
```

package.json 加入指令：
```json
"scripts": {
    "build": "webpack --config webpack.config.test.js",
    "test": "mocha .\\test\\test.js",
    "test-build": "mocha .\\dist\\test.js"
}
```

之後就可以先使用 `yarn-build` 編譯測試檔，再使用 `yarn test-build` 來測試編譯過後的測試檔，當然也可以讓 webpack 加入 babel 套件將測試程式轉譯成 es5 測試，可以參考 babel-loader 章節。

接下來是最令人匪夷所思的部分，既然 mocha 可以單獨執行，只要在 package.json 加上指令 `"test":"mocha"` 就可以下 `yarn test` 執行單元測試，那為什麼還有 [webpack-mocha](https://www.npmjs.com/package/mocha-webpack) 、 [mocha-loader](https://webpack.js.org/loaders/mocha-loader/) 套件混淆視聽呢?

#### webpack-mocha
它舉了個例子，如果想要把 test.js 經過 webpack 編譯後再執行測試，則要這樣下指令：
```bash
yarn webpack .\test\test.js -o .\dist\output.js --mode development --devtool none && yarn mocha .\dist\output.js
```

如果使用 mocha-webpack 可以有以下便利：
* 在 webpack 執行測試前自動先編譯測試檔案
* 可以自動為你處理 source-map 檔案
* 不會寫入任何檔案
* 就像 mocha 一樣可以了解全域與所有其他事務做為測試項目

* 幾乎與 mocha 的指令一樣
* 不用依賴一些有的沒的 webpack 的套件，像是 path
* 有比 mocha 更好的 watch 功能

然後就可以用以下指令做單元測試：
```bash
yarn mocha-webpack "test/**/*.js"
```

以上是不負責任的照翻，不過看到這裡覺得好像不一定要使用也可以，而且沒有看到要怎麼把這個設定在 webpack config 裡，所以等有用到回頭再說。

#### mocha-loader
這個我有寫在 Loader 的分區裡，可以去看一下，簡單的說它可以將測試報告編譯成 js，然後嵌入到網頁後就會呈現出測試報告，這似乎可以用得到，可以測試各瀏覽器是否測是正確。