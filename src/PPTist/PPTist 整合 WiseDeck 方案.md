为了在不改变 WiseDeck 现有技术栈、且“保持原样、不二次转化”的前提下完美整合，我为你设计了 **“微前端架构 (IFrame) + 跨窗口状态同步 (postMessage)”** 的落地方案。这是目前将现代大型编辑器无缝嵌入传统全栈项目中最稳定、侵入性最小的做法。

---

### 一、 架构方案：IFrame 微前端与跨窗口通信

**核心思路：** 将 PPTist 作为一个独立的 Vue 应用进行打包，并将打包后的静态产物放入 WiseDeck 的 `static` 目录中由 FastAPI 托管。
在 WiseDeck 的幻灯片编辑页面，点击“完整编辑”时，弹出一个全屏的 Modal，内部嵌入一个指向 PPTist 的 `<iframe>`。通过原生 JS 的 `postMessage` API 实现数据的无缝注入和保存提取。

**数据流转过程：**

1. **触发与注入**：用户在 WiseDeck 点击“完整编辑” -> 弹出全屏 Modal -> 获取当前 JS 内存中的 PPT JSON 数据 -> 通过 `iframe.contentWindow.postMessage` 将数据直接注入到 PPTist 的 Pinia Store。

2. **编辑**：用户在完全一致的 PPTist 界面中操作，无样式污染。

3. **回传与关闭**：用户点击“保存并返回” -> PPTist 通过 `window.parent.postMessage` 将最新 JSON 回传给 WiseDeck -> WiseDeck 更新视图并关闭 Modal。

---

### 二、 文件结构设计

将 PPTist 的源码独立放在项目根目录的一个新文件夹中（方便独立打包），将编译产物输出到 FastAPI 的 `static` 目录中。

WiseDeck/
├── pptist-source/                   # 【新增】存放你上传的 PPTist 全部源码
│   ├── src/
│   │   ├── views/Editor/EditorHeader/index.vue  # 需修改：增加保存按钮及通信逻辑
│   │   ├── App.vue                              # 需修改：增加监听 postMessage 逻辑
│   ├── package.json
│   └── vite.config.ts               # 需修改：base 路径配置为 /static/pptist_dist/
│
├── src/
│   ├── wisedeck/
│   │   ├── static/
│   │   │   ├── pptist_dist/         # 【新增】PPTist 执行 npm run build 后的产物
│   │   │   └── js/slide_editor.js   # WiseDeck 原生的幻灯片编辑脚本
│   │   ├── web/
│   │   │   ├── templates/
│   │   │   │   └── slide/edit.html  # WiseDeck 现有的 PPT 编辑 Jinja2 模板
│   │   └── main.py                  # FastAPI 主入口 (确认已挂载 static)

### 三、 方案实现说明

#### 1. PPTist 源码层改造 (Vue 端)

**A. 监听数据注入 (`pptist-source/src/App.vue`)** 在 `App.vue` 的 `onMounted` 钩子中，增加对父窗口消息的监听，接收到数据后直接写入 Pinia。

import { useSlidesStore } from '@/store/slides'

window.addEventListener('message', (event) => {
  // 安全校验可根据需要添加
  if (event.data && event.data.type === 'SYNC_SLIDES_TO_PPTIST') {
    const slidesStore = useSlidesStore();
    // 直接覆盖当前幻灯片数据，不进行二次转化
    slidesStore.setSlides(event.data.slides); 
    if (event.data.slideIndex !== undefined) {
      slidesStore.setSlideIndex(event.data.slideIndex);
    }
  }
});

**B. 触发数据回传 (`pptist-source/src/views/Editor/EditorHeader/index.vue`)** 在顶部工具栏添加一个“保存并返回”按钮：

const saveAndExit = () => {
  const slidesStore = useSlidesStore();
  // 将最新的幻灯片数据发送给 WiseDeck 父窗口
  window.parent.postMessage({
    type: 'SAVE_SLIDES_FROM_PPTIST',
    slides: JSON.parse(JSON.stringify(slidesStore.slides))
  }, '*');
}

#### 2. WiseDeck 宿主层改造 (Vanilla JS 端)

在你的 `slide_editor.js` 或 Jinja2 模板中加入全屏弹窗控制逻辑：

const iframeModal = document.getElementById('pptist-modal');
const pptistIframe = document.getElementById('pptist-iframe');

// 1. 点击完整编辑，打开 Modal 并发送数据
function openFullEdit() {
  iframeModal.style.display = 'block';

  // 假设 currentWiseDeckSlides 是你当前内存中的 PPT JSON
  const payload = {
    type: 'SYNC_SLIDES_TO_PPTIST',
    slides: currentWiseDeckSlides, 
    slideIndex: currentActiveIndex
  };

  // 等待 iframe 加载完成后发送消息
  pptistIframe.contentWindow.postMessage(payload, '*');
}

// 2. 监听 PPTist 传回的保存指令
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SAVE_SLIDES_FROM_PPTIST') {
    // 覆盖本地数据
    currentWiseDeckSlides = event.data.slides;

    // 更新 WiseDeck 视图或向 FastAPI 发起保存请求
    updateWiseDeckView(); 
    
    // 关闭 Modal
    iframeModal.style.display = 'none';

  }
});

### 四、 投喂给 Trae 工具的提示词 (Prompts)

由于这个修改跨越了两个独立的技术栈（FastAPI 原生前端 + Vue3 Vite 打包），建议分三步交给 Trae 执行。**请依次复制以下 Prompt 发送给 Trae**：

#### 第一步：初始化 PPTist 子工程与 Vite 配置

> **提示词：** “Trae，我们需要将我上传的 `pptist` 源码作为一个独立的前端模块整合到 WiseDeck 中。由于 WiseDeck 前端是基于原生 JS 和 Jinja2 的，为了避免冲突，我们采用 IFrame 微前端方案。
> 
> 1. 请在 WiseDeck 项目根目录下创建一个新文件夹 `pptist-source/`，并将上传的 pptist 所有源码（包括 package.json, vite.config.ts, src 等）移动到这个目录中。
> 
> 2. 修改 `pptist-source/vite.config.ts`，将其 `base` 路径配置为 `/static/pptist_dist/`，同时修改 `build.outDir` 将打包输出目录设置为 `../src/wisedeck/static/pptist_dist`。
> 
> 3. 检查并确保 FastAPI 的 `main.py` 中已经正确配置了对 `static` 目录的挂载。”

#### 第二步：改造 PPTist 的跨窗口通信 (postMessage)

> **提示词：** “Trae，现在请为 `pptist-source` 增加与宿主窗口（WiseDeck）通信的能力。
> 
> 1. 打开 `pptist-source/src/App.vue`，在 `onMounted` 钩子中增加 `window.addEventListener('message')`。当监听到 `event.data.type === 'SYNC_SLIDES_TO_PPTIST'` 时，提取 `event.data.slides`，并使用 `useSlidesStore().setSlides()` 将数据直接注入，不进行任何转化。如果包含 `slideIndex`，也一并注入。
> 
> 2. 打开 `pptist-source/src/views/Editor/EditorHeader/index.vue`。请在 UI 合适的位置（例如顶部右侧）增加一个名为“保存并返回”的按钮（或替换原有的导出/播放按钮）。
> 
> 3. 为这个按钮绑定点击事件：获取 `useSlidesStore().slides` 的最新数据，并通过 `window.parent.postMessage({ type: 'SAVE_SLIDES_FROM_PPTIST', slides: 数据 }, '*')` 发送给父窗口。”

#### 第三步：在 WiseDeck 中集成 IFrame 弹窗

> **提示词：** “Trae，最后一步是修改 WiseDeck 的原生前端逻辑，也就是处理幻灯片编辑的 Jinja2 模板（如 `slide_routes.py` 关联的 html 文件）及对应的原生 JavaScript 文件。
> 
> 1. 在 PPT 编辑页面的 HTML 中，请帮我添加一个全屏的 Modal 结构（默认隐藏，设置较高的 z-index），里面包含一个 `<iframe id="pptist-iframe" src="/static/pptist_dist/index.html" style="width: 100%; height: 100%; border: none;"></iframe>`。
> 
> 2. 在对应的原生 JS 文件中，编写 `openFullEdit()` 函数：当用户在 WiseDeck 点击【完整编辑】时，显示这个 Modal，并使用 `postMessage` 向 iframe 发送当前幻灯片数据的 JSON（`type: 'SYNC_SLIDES_TO_PPTIST'`）。
> 
> 3. 在原生 JS 中添加全局监听器 `window.addEventListener('message')`，接收 `type === 'SAVE_SLIDES_FROM_PPTIST'` 的消息，接收到后更新 WiseDeck 当前的幻灯片数据对象，并隐藏 Modal。”

执行完这三步后，你只需要在命令行进入 `pptist-source` 目录运行 `npm install` 和 `npm run build`，FastAPI 就会自动通过静态资源代理这个完整的 PPTist 编辑器，从而实现像素级一致且无缝的数据双向绑定！
