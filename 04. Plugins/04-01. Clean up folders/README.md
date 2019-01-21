## Clean up folders

### 清空資料夾
 有時會希望建置時先確保輸出的資料夾是乾淨的前置作業，再做複製檔案或是進行編譯，清空資料夾可以靠 [clean-webpack-plugin](https://webpack.js.org/guides/output-management/#cleaning-up-the-dist-folder) 這個套件來達成，首先要先進行安裝：
```bash
yarn add clean-webpack-plugin --dev
```

測試之前先執行 `build-dev` 與 `build-prod` 兩個建置指令生成 3 個檔案，所以預計修改後執行 `build-dev` 後應該只會剩一個檔案為 app.js。

修改一下 webconfig.config.base
```js
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    ...,
    plugins: [
        new CleanWebpackPlugin([
            '../dist'
        ])
    ]
}
```

執行 `build-dev` 會發現出現以下訊息：
``` bash
clean-webpack-plugin: \dist is outside of the project root. Skipping...
```

表示 plugin 無法清除 root 以外的資料，所以到 [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin) 官方說明說到如果要清除 root 以外的資料，需要設定 allowExternal 為 true ，所以試試看：
```js
plugins: [
    new CleanWebpackPlugin([
        '../dist' //可設定多個資料夾
    ],{
        allowExternal: true
    })
]
```

執行後只剩 app.js 其餘都刪除了，表示成功。