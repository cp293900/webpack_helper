## Karma
### 前言
先前提到 forge 是使用 karma + mocha + assert 配置，現在就來談談為何要使用 [karma](https://karma-runner.github.io/latest/index.html)，經過幾番研究發現 karma 並非是一個可以單獨執行的單元測試工具，比較像一個容器，需要很多的套件使它強大，那 karma 能解決什麼樣的問題呢 ? 先前有提到 mocha-loader 其實可以生成一個 js 讓網頁引用便可以渲染出報告，這個網頁就可以使用各瀏覽器開啟看測試報告來知道對瀏覽器的支援度，而 karma 在做的就是很像這類的工具。

### 運行過程
karma 會啟動一個 server ， server 會載入 karma 的設定檔，然後會依據設定檔載入單元測試框架( mocha 或是 jasmine 等等)，再載入要測試的程式、 server 會依據是什麼框架去下測試指令然後出報告，到這裡還看不出 karma 的特色在哪，接下來可以根據設定來決定要測試哪些瀏覽器， server 就會自行開啟瀏覽器，甚至出一個覆蓋測試報告，而這些才是 karma 的特色，但都是要額外安裝套件，所以要讓前端的測試豐富到時麼程度，就要看對套件的了解程度。

### 安裝
```bash
yarn add karma --dev
```