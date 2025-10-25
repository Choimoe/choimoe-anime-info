# 个人扩列条

这是一个静态的、由 JSON 配置文件 + JavaScript 驱动的个人信息展示页面，您可以在 [摸鱼的qiqi 的 扩列条](http://info.choimoe.com/) 查看示例。

## 简介

本项目使用 HTML、CSS 和 JavaScript 创建一个单页的个人"扩列条"（个人信息卡片）。所有的文本、链接、列表和图片内容都从一个外部的 `content.json` 文件动态加载，这使得更新个人信息变得非常简单，无需修改任何 HTML 或 JavaScript 代码。

## 工作原理

当用户在浏览器中打开 index.html 时：

1. index.html 文件会加载并执行 ./scripts/load-content.js 脚本。
2. load-content.js 脚本会异步请求 ./config/content.json 文件的内容。
3. 获取到 JSON 数据后，脚本会遍历 index.html 中的 DOM 元素，查找 data-key、data-key-src 等属性。
4. 脚本会将 JSON 中对应的数据填充到具有相应 data-key 的 HTML 元素中，从而动态生成页面内容。

## 如何自定义

**您唯一需要编辑的文件是** `./config/content.json`。

打开 `config/content.json` 文件，您可以修改其中的任何值来自定义您的个人资料：

- `meta`: 网站元数据，如标题 (titleTemplate) 和网页图标 (favicon)。
- `profile`: 您的基本信息，包括昵称、头像链接 (avatarSrc)、二维码链接 (qrCodeSrc) 等。
- `about`: "关于我"板块的内容，包括简介 (intro) 和各个子项目（喜欢、在玩、感兴趣）。
- `musicGames`, `achievements`: 其他自定义卡片的内容。
- `oshis`: "推し"（喜欢的人物）列表。
- `footer`: 页脚的版权和链接信息。

所有更改都会在刷新页面后自动显示。

## 如何本地运行

由于此项目使用 `fetch` API 来加载 `content.json` 文件，您不能直接通过 `file://` 协议在浏览器中双击打开 `index.html` 文件（这会导致跨域安全错误）。

您需要在一个本地 Web 服务器上运行它。

- 最简单的方法 (如果您的电脑已安装 Python):

  在项目根目录打开终端或命令行，运行

  ```bash
  python -m http.server
  ```

  在浏览器中打开 [http://localhost:8000](http://localhost:8000) (或终端上显示的相应地址)。

- 使用 VS Code:

  在 VS Code 中打开项目文件夹。

  安装 Live Server 插件。

  在 VS Code 的文件浏览器中，右键点击 index.html 文件，选择 "Open with Live Server"。
