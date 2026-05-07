# WiseDeck 项目代码百科全书

> 本文档由 AI 代码分析工具自动生成，基于项目源码结构
> 生成时间：2026-05-07
> 项目版本：0.1.8

---

## 目录

- [项目概述](#1-项目概述)
- [项目架构](#2-项目架构)
- [核心模块详解](#3-核心模块详解)
- [关键类与函数](#4-关键类与函数)
- [数据库模型](#5-数据库模型)
- [API路由体系](#6-api路由体系)
- [服务层架构](#7-服务层架构)
- [依赖关系](#8-依赖关系)
- [项目运行方式](#9-项目运行方式)
- [配置说明](#10-配置说明)

---

## 1. 项目概述

### 1.1 项目简介

**WiseDeck** 是一个基于大语言模型（LLM）的智能演示文稿生成平台，能够自动将文档内容转换为专业的PPT演示文稿。

### 1.2 核心技术栈

| 层级 | 技术选型 |
|------|----------|
| **后端框架** | FastAPI 0.104+、Uvicorn、Pydantic v2 |
| **数据库** | SQLAlchemy 2.0、SQLite（开发）、PostgreSQL（生产） |
| **AI集成** | OpenAI GPT、Anthropic Claude、Google Gemini、LangChain、LangGraph |
| **文档处理** | python-pptx、MinerU、MarkItDown、BeautifulSoup4 |
| **图像处理** | Pillow、Playwright、Apryse SDK |
| **缓存** | Valkey（Redis兼容） |
| **前端** | 原生 JavaScript (ES6+)、Jinja2 模板 |

### 1.3 项目结构

```
WiseDeck/
├── src/
│   ├── wisedeck/              # 主应用包
│   │   ├── api/               # API 路由层
│   │   ├── auth/             # 认证授权
│   │   ├── core/             # 核心配置
│   │   ├── database/         # 数据库层
│   │   ├── services/         # 业务服务层
│   │   ├── web/              # Web 界面
│   │   └── main.py           # 应用入口
│   └── summeryanyfile/       # 文档处理模块
├── scripts/                   # 脚本工具
├── skills/                    # AI Skills 定义
└── tests/                     # 测试用例
```

---

## 2. 项目架构

### 2.1 分层架构

```
┌─────────────────────────────────────────────────────┐
│                   Web 层 (FastAPI)                   │
│  ├── 路由定义 (routes.py)                          │
│  ├── Web 路由 (route_modules/)                      │
│  └── 静态资源 (static/)                             │
├─────────────────────────────────────────────────────┤
│                   API 层 (api/)                     │
│  ├── wisedeck_api.py    - 核心业务 API              │
│  ├── global_master_template_api.py - 模板管理 API   │
│  ├── image_api.py        - 图片服务 API             │
│  ├── config_api.py       - 配置管理 API             │
│  └── openai_compat.py    - OpenAI 兼容接口          │
├─────────────────────────────────────────────────────┤
│                 Service 层 (services/)              │
│  ├── slide/        - PPT 生成服务                   │
│  ├── template/     - 模板服务                       │
│  ├── outline/      - 大纲生成服务                  │
│  ├── image/        - 图片处理服务                   │
│  ├── research/     - 深度研究服务                  │
│  ├── runtime/      - 运行时服务                    │
│  └── structured_export/ - 结构化导出               │
├─────────────────────────────────────────────────────┤
│                 Database 层 (database/)             │
│  ├── models.py     - SQLAlchemy 模型                │
│  ├── database.py   - 数据库连接                      │
│  ├── repositories.py - 数据仓储                     │
│  └── service.py    - 数据服务                       │
├─────────────────────────────────────────────────────┤
│                 Core 层 (core/)                     │
│  ├── config.py     - 应用配置                       │
│  └── request_context.py - 请求上下文                │
└─────────────────────────────────────────────────────┘
```

### 2.2 核心流程

```
用户请求
    ↓
Web 路由层 (route_modules/)
    ↓
API 路由层 (api/)
    ↓
Service 服务层 (services/)
    ↓
Database 数据层 (database/)
    ↓
响应返回
```

---

## 3. 核心模块详解

### 3.1 应用入口 [main.py](file:///c:/dev/WiseDeck/src/wisedeck/main.py)

**文件路径**: `src/wisedeck/main.py`

**核心功能**:
- 初始化 FastAPI 应用
- 注册中间件（CORS、API Key）
- 注册所有路由
- 挂载静态文件
- 启动/关闭事件处理

**关键代码结构**:
```python
# 应用初始化
app = FastAPI(
    title="WiseDeck API",
    description="AI-powered PPT generation platform",
    version="0.1.0"
)

# 路由注册
app.include_router(config_router, prefix="", tags=["Configuration Management"])
app.include_router(image_router, prefix="", tags=["Image Service"])
app.include_router(web_router, prefix="", tags=["Web Interface"])
app.include_router(openai_router, prefix="/v1", tags=["OpenAI Compatible"])
app.include_router(wisedeck_api_router, prefix="/api", tags=["WiseDeck API"])
app.include_router(template_api_router, tags=["Global Master Templates"])
```

### 3.2 Web 路由聚合 [routes.py](file:///c:/dev/WiseDeck/src/wisedeck/web/routes.py)

**文件路径**: `src/wisedeck/web/routes.py`

**包含的子路由**:
| 路由模块 | 功能 |
|----------|------|
| `config_routes.py` | 配置管理页面 |
| `project_routes.py` | 项目管理（生命周期、工作区、素材库） |
| `outline_routes.py` | 大纲生成（需求确认、大纲生成） |
| `share_routes.py` | 分享功能 |
| `narration_routes.py` | 配音功能 |
| `template_routes.py` | 模板选择 |
| `export_routes.py` | 导出功能 |
| `slide_routes.py` | 幻灯片编辑 |
| `ai_edit_routes.py` | AI 编辑 |
| `speech_script_routes.py` | 演讲稿 |
| `project_context_routes.py` | 项目上下文 |

### 3.3 模板服务模块 [template/](file:///c:/dev/WiseDeck/src/wisedeck/services/template/)

**目录路径**: `src/wisedeck/services/template/`

#### 3.3.1 核心文件说明

| 文件 | 功能 |
|------|------|
| `template_import_service.py` | PPT/PPTX 导入服务 |
| `global_master_template_service.py` | 全局母版模板服务 |
| `pptx_physical_structure.py` | python-pptx 物理结构提取 |
| `pptx_slide_layout_hints.py` | 幻灯片布局提示提取 |
| `visual_dna_v1.py` / `visual_dna_v2.py` | 视觉 DNA 提取 |
| `template_contract_build.py` | 模板契约构建 |
| `template_mapping_builder.py` | 模板映射构建 |
| `pptx_readable_runner.py` | pptxtojson Node 脚本执行器 |
| `pptx_readable_placeholders.py` | 占位符类型映射 |
| `libreoffice_html_exporter.py` | LibreOffice HTML 导出 |
| `svg_template_import_meta.py` | SVG 模板导入元数据 |

#### 3.3.2 PPT 导入流程

```
用户上传 PPT/PPTX
    ↓
TemplateImportService.import_from_upload()
    ↓
┌─────────────────────────────────────────────┐
│ 1. 解析阶段 (Parsing)                        │
│    - python-pptx 提取母版和版式              │
│    - 提取主题色、字体、占位符坐标             │
├─────────────────────────────────────────────┤
│ 2. 提取阶段 (Extraction)                      │
│    - extract_pptx_layout_hints()            │
│    - extract_pptx_physical_structure()       │
│    - extract_visual_dna_v2()                │
│    - parse_pptx_to_readable_json()         │
├─────────────────────────────────────────────┤
│ 3. 映射阶段 (Mapping)                         │
│    - build_mapping_rules_from_physical_structure() │
│    - enrich_template_manifest_with_layout_package() │
└─────────────────────────────────────────────┘
    ↓
生成模板配置 JSON
```

### 3.4 幻灯片服务模块 [slide/](file:///c:/dev/WiseDeck/src/wisedeck/services/slide/)

**目录路径**: `src/wisedeck/services/slide/`

| 文件 | 功能 |
|------|------|
| `slide_generation_service.py` | 幻灯片生成服务 |
| `slide_content_service.py` | 幻灯片内容服务 |
| `slide_html_service.py` | 幻灯片 HTML 生成 |
| `slide_document_service.py` | 幻灯片文档服务 |
| `creative_design_service.py` | 创意设计服务 |
| `layout_repair_service.py` | 布局修复服务 |
| `layout_scorer.py` | 布局评分 |
| `slide_streaming_service.py` | 流式生成服务 |
| `slide_media_service.py` | 幻灯片媒体服务 |

### 3.5 大纲服务模块 [outline/](file:///c:/dev/WiseDeck/src/wisedeck/services/outline/)

**目录路径**: `src/wisedeck/services/outline/`

| 文件 | 功能 |
|------|------|
| `project_outline_generation_service.py` | 大纲生成 |
| `project_outline_validation_service.py` | 大纲验证 |
| `project_outline_normalization_service.py` | 大纲标准化 |
| `project_outline_workflow_service.py` | 大纲工作流服务 |
| `outline_workflow_service.py` | 工作流服务 |
| `page_count_limits.py` | 页数限制 |

### 3.6 图片服务模块 [image/](file:///c:/dev/WiseDeck/src/wisedeck/services/image/)

**目录路径**: `src/wisedeck/services/image/`

#### 3.6.1 提供商架构

| 提供商 | 功能 |
|--------|------|
| `openai_image_provider.py` | OpenAI DALL-E |
| `dalle_provider.py` | DALL-E 专用 |
| `gemini_provider.py` | Google Gemini |
| `silicon_flow_provider.py` | SiliconFlow |
| `pollinations_provider.py` | Pollinations AI |
| `stable_diffusion_provider.py` | Stable Diffusion |
| `pixabay_provider.py` | Pixabay 图库 |
| `unsplash_provider.py` | Unsplash 图库 |
| `searxng_image_provider.py` | SearXNG 元搜索 |
| `local_storage_provider.py` | 本地存储 |

#### 3.6.2 核心服务

- `image_service.py` - 图片服务主入口
- `image_matcher.py` - 图片匹配
- `image_processor.py` - 图片处理
- `webp_converter.py` - WebP 格式转换
- `image_cache.py` - 图片缓存

### 3.7 研究服务模块 [research/](file:///c:/dev/WiseDeck/src/wisedeck/services/research/)

**目录路径**: `src/wisedeck/services/research/`

| 文件 | 功能 |
|------|------|
| `enhanced_research_service.py` | 增强研究服务 |
| `content_extractor.py` | 内容提取 |
| `searxng_provider.py` | SearXNG 提供商 |
| `enhanced_report_generator.py` | 报告生成 |

---

## 4. 关键类与函数

### 4.1 模板导入核心类

#### 4.1.1 TemplateImportService

**文件**: [template_import_service.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/template_import_service.py#L275-L483)

```python
class TemplateImportService:
    """导入 PPT/PPTX 到 TemplateReferenceWorkspace"""
    
    def __init__(self, *, cache_root, extract_fn):
        """初始化导入服务"""
        
    def import_from_upload(self, *, filename, data, png_zoom=2.0) -> TemplateReferenceWorkspace:
        """从上传文件导入 PPT"""
        
    def build_lightweight_structured_manifest(self, pptx_path, *, workspace_id, slide_count, ...) -> dict:
        """构建轻量级结构化清单（跳过 PDF→SVG）"""
        
    def import_pdf_from_upload(self, *, filename, data, png_zoom=2.0) -> TemplateReferenceWorkspace:
        """从上传 PDF 导入模板"""
```

#### 4.1.2 TemplateReferenceWorkspace

**文件**: [template_import_service.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/template_import_service.py#L247-L272)

```python
@dataclass
class TemplateReferenceWorkspace:
    workspace_id: str
    root_dir: Path
    source_filename: str
    pptx_path: Path
    pdf_path: Path
    manifest_path: Path
    svg_dir: Path
    png_dir: Path
    manifest: Dict[str, Any]
    
    def to_summary_dict(self) -> Dict[str, Any]:
        """返回摘要字典"""
```

### 4.2 PPTX 解析核心函数

#### 4.2.1 extract_pptx_layout_hints

**文件**: [pptx_slide_layout_hints.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/pptx_slide_layout_hints.py#L53-L156)

```python
def extract_pptx_layout_hints(pptx_bytes: bytes) -> Dict[str, Any]:
    """
    提取 PPTX 布局提示
    
    返回:
        schema_version, slide_width_emu, slide_height_emu,
        slides: [{index, shapes: [{bbox, placeholder_type, is_placeholder, shape_kind}]}]
    """
```

#### 4.2.2 extract_pptx_physical_structure

**文件**: [pptx_physical_structure.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/pptx_physical_structure.py#L134-L286)

```python
def extract_pptx_physical_structure(pptx_bytes: bytes) -> Dict[str, Any]:
    """
    提取 PPTX 物理结构
    
    返回:
        schema_version, slide_width_emu, slide_height_emu,
        slides: [{index, layout_name, shapes:[...]}]
        
    shapes 包含:
        shape_id, kind, is_placeholder, placeholder_type, 
        bbox_emu, bbox, text_frame, is_static, static_role
    """
```

#### 4.2.3 extract_visual_dna_v2

**文件**: [visual_dna_v2.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/visual_dna_v2.py#L86-L234)

```python
def extract_visual_dna_v2(*, pptx_bytes: bytes, style_id: str, assets_out_dir: Path) -> VisualDNAV2:
    """
    提取视觉 DNA (颜色、字体、资产)
    
    返回 VisualDNAV2 对象，包含:
    - style_id: 样式 ID
    - slide_count: 幻灯片数量
    - palette_top5: 顶部 5 颜色
    - primary_color: 主色
    - fonts: 字体信息
    - master_selection: 母版选择
    - exported_assets: 导出的资产
    """
```

#### 4.2.4 build_mapping_rules_from_physical_structure

**文件**: [template_mapping_builder.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/template_mapping_builder.py#L85-L168)

```python
def build_mapping_rules_from_physical_structure(physical_structure: Dict) -> Dict:
    """
    从物理结构构建映射规则
    
    返回:
    {
        schema_version: 1,
        rules: {
            fields: { title/subtitle/body: {marker, shape_candidates:[...]}},
            layout_signatures: [{index, layout_name, markers, roles}]
        }
    }
    """
```

### 4.3 占位符类型映射

#### ooxml_placeholder_type_to_marker

**文件**: [pptx_readable_placeholders.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/pptx_readable_placeholders.py#L16-L35)

```python
def ooxml_placeholder_type_to_marker(ph_type: str) -> Optional[str]:
    """OOXML 占位符类型 → WiseDeck 标记名"""
    aliases = {
        "TITLE": "PAGE_TITLE",
        "CTRTITLE": "PAGE_TITLE",
        "SUBTITLE": "SUBTITLE",
        "BODY": "CONTENT_AREA",
        "OBJECT": "CONTENT_AREA",
        "PIC/PICTURE": "CONTENT_AREA",
        "CHART": "CHART_AREA",
        "TBL/TABLE": "TABLE_AREA",
    }
```

### 4.4 幻灯片生成核心类

#### SlideGenerationService

**文件**: [slide_generation_service.py](file:///c:/dev/WiseDeck/src/wisedeck/services/slide/slide_generation_service.py)

主要方法：
- `generate_slides()` - 生成幻灯片
- `generate_slide_content()` - 生成幻灯片内容
- `apply_template()` - 应用模板

#### SlideHtmlService

**文件**: [slide_html_service.py](file:///c:/dev/WiseDeck/src/wisedeck/services/slide/slide_html_service.py)

主要方法：
- `render_slide()` - 渲染幻灯片 HTML
- `render_slides()` - 批量渲染

### 4.5 大纲生成核心类

#### ProjectOutlineGenerationService

**文件**: [project_outline_generation_service.py](file:///c:/dev/WiseDeck/src/wisedeck/services/outline/project_outline_generation_service.py)

主要方法：
- `generate_outline()` - 生成大纲
- `stream_outline()` - 流式生成大纲
- `validate_outline()` - 验证大纲

---

## 5. 数据库模型

### 5.1 核心模型 [models.py](file:///c:/dev/WiseDeck/src/wisedeck/database/models.py)

#### 5.1.1 User 模型

```python
class User(Base):
    __tablename__ = "users"
    
    id: int                    # 主键
    username: str              # 用户名（唯一）
    password_hash: str         # 密码哈希
    email: Optional[str]        # 邮箱（唯一）
    phone: Optional[str]       # 电话
    avatar: Optional[str]      # 头像
    is_active: bool           # 是否激活
    is_admin: bool            # 是否管理员
    credits_balance: int      # 积分余额
    created_at: float         # 创建时间
    github_id: Optional[str]   # GitHub OAuth ID
    linuxdo_id: Optional[str]  # LinuxDo OAuth ID
    oauth_provider: Optional[str]  # OAuth 提供商
```

#### 5.1.2 Project 模型

```python
class Project(Base):
    __tablename__ = "projects"
    
    id: int                    # 主键
    project_id: str            # 项目 UUID
    user_id: int               # 所有者 ID
    title: str                 # 标题
    scenario: str              # 场景
    topic: str                 # 主题
    requirements: Optional[str]  # 需求
    status: str                # 状态 (draft/...)
    outline: Optional[Dict]     # 大纲 JSON
    slides_html: Optional[str]  # 幻灯片 HTML
    slides_data: Optional[List[Dict]]  # 幻灯片数据
    confirmed_requirements: Optional[Dict]  # 确认的需求
    project_metadata: Optional[Dict]  # 项目元数据
    design_spec: Optional[Dict]  # 设计规范
    share_token: Optional[str]  # 分享令牌
    share_enabled: bool        # 是否启用分享
```

#### 5.1.3 其他重要模型

| 模型 | 表名 | 功能 |
|------|------|------|
| `UserSession` | user_sessions | 用户会话 |
| `UserAPIKey` | user_api_keys | API 密钥 |
| `UserMetrics` | user_metrics | 用户指标 |
| `TodoBoard` | todo_boards | TODO 看板 |
| `GlobalMasterTemplate` | global_master_templates | 全局母版模板 |

### 5.2 模型关系

```
User (1) ──────< Project (N)
User (1) ──────< UserSession (N)
User (1) ──────< UserAPIKey (N)
User (1) ──────< UserMetrics (1)
Project (1) ──< TodoBoard (1)
```

---

## 6. API 路由体系

### 6.1 API 路由注册 [main.py](file:///c:/dev/WiseDeck/src/wisedeck/main.py#L100-L110)

```python
app.include_router(config_router, prefix="", tags=["Configuration Management"])
app.include_router(image_router, prefix="", tags=["Image Service"])
app.include_router(web_router, prefix="", tags=["Web Interface"])
app.include_router(openai_router, prefix="/v1", tags=["OpenAI Compatible"])
app.include_router(wisedeck_api_router, prefix="/api", tags=["WiseDeck API"])
app.include_router(template_api_router, tags=["Global Master Templates"])
app.include_router(database_router, tags=["Database Management"])
```

### 6.2 核心 API 端点

#### 6.2.1 项目管理 API (`/api/projects/`)

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/api/projects/` | 获取项目列表 |
| POST | `/api/projects/` | 创建项目 |
| GET | `/api/projects/{project_id}` | 获取项目详情 |
| PUT | `/api/projects/{project_id}` | 更新项目 |
| DELETE | `/api/projects/{project_id}` | 删除项目 |

#### 6.2.2 大纲生成 API (`/api/outline/`)

| 方法 | 端点 | 功能 |
|------|------|------|
| POST | `/api/outline/generate` | 生成大纲 |
| POST | `/api/outline/validate` | 验证大纲 |
| PUT | `/api/outline/{project_id}` | 更新大纲 |

#### 6.2.3 模板管理 API (`/api/global-master-templates/`)

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/api/global-master-templates/` | 获取模板列表 |
| POST | `/api/global-master-templates/` | 创建模板 |
| PUT | `/api/global-master-templates/{id}` | 更新模板 |
| DELETE | `/api/global-master-templates/{id}` | 删除模板 |
| POST | `/api/global-master-templates/import/convert-office-template` | 导入 PPT/PPTX |
| POST | `/api/global-master-templates/generate` | AI 生成模板 |

#### 6.2.4 OpenAI 兼容 API (`/v1/`)

| 方法 | 端点 | 功能 |
|------|------|------|
| POST | `/v1/chat/completions` | 聊天补全 |
| POST | `/v1/completions` | 文本补全 |
| GET | `/v1/models` | 获取模型列表 |

### 6.3 API 认证方式

#### 6.3.1 Session 认证
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -d "username=admin" -d "password=xxx"
# 返回 session_id，存入 Cookie
```

#### 6.3.2 API Key 认证
```bash
# 全局 API Key
curl -H "Authorization: Bearer <WISEDECK_API_KEY>" ...

# 用户自定义 API Key
curl -H "Authorization: Bearer <user-api-key>" ...
```

---

## 7. 服务层架构

### 7.1 服务实例管理 [service_instances.py](file:///c:/dev/WiseDeck/src/wisedeck/services/service_instances.py)

```python
# 全局服务单例
ppt_service: EnhancedPPTService
config_service: ConfigService
image_service: ImageService
share_service: ShareService
```

### 7.2 PPT 服务 [ppt_service.py](file:///c:/dev/WiseDeck/src/wisedeck/services/ppt_service.py)

```python
class EnhancedPPTService:
    """增强的 PPT 生成服务"""
    
    project_manager: DatabaseProjectManager
    
    async def create_project(self, user_id, title, topic, ...) -> Project:
        """创建项目"""
        
    async def generate_ppt(self, project_id, template_id, ...) -> dict:
        """生成 PPT"""
        
    async def export_ppt(self, project_id, format, ...) -> FileResponse:
        """导出 PPT"""
```

### 7.3 运行时服务 [runtime/](file:///c:/dev/WiseDeck/src/wisedeck/services/runtime/)

| 服务 | 功能 |
|------|------|
| `runtime_ai_service.py` | AI 运行时服务 |
| `runtime_image_service.py` | 图片运行时服务 |
| `runtime_research_service.py` | 研究运行时服务 |
| `runtime_config_service.py` | 配置运行时服务 |

---

## 8. 依赖关系

### 8.1 核心依赖 [pyproject.toml](file:///c:/dev/WiseDeck/pyproject.toml)

```toml
[project]
dependencies = [
    # Web 框架
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.24.0",
    "pydantic>=2.5.0",
    "python-multipart>=0.0.6",
    "jinja2>=3.1.2",
    
    # 数据库
    "sqlalchemy>=2.0.0",
    "alembic>=1.13.0",
    "aiosqlite>=0.19.0",
    "asyncpg>=0.29.0",
    
    # 缓存
    "valkey>=6.0.0",
    
    # AI & LLM
    "openai>=1.0.0",
    "anthropic>=0.7.0",
    "google-generativeai>=0.3.0",
    "ollama>=0.1.0",
    "langchain>=0.1.0",
    "langgraph>=0.2.0",
    
    # 文档处理
    "python-pptx>=0.6.23",
    "pymupdf>=1.24.0",
    "markitdown[all]>=0.1.2",
    "beautifulsoup4>=4.12.0",
    
    # 图像 & 导出
    "pillow>=10.0.0",
    "playwright>=1.40.0",
    "apryse-sdk>=11.6.0",
    "edge-tts>=6.1.0",
    
    # 其他
    "httpx>=0.25.0",
    "click>=8.0.0",
    "python-dotenv>=1.0.0",
]
```

### 8.2 可选依赖

```toml
[project.optional-dependencies]
mcp = ["mcp>=1.6.0"]
dev = ["pytest>=7.0.0", "black>=23.0.0", "mypy>=1.0.0"]
test = ["pytest>=7.0.0", "pytest-asyncio>=0.21.0"]
```

### 8.3 依赖关系图

```
FastAPI / Uvicorn
    ├── Pydantic
    ├── Starlette
    └── python-multipart

SQLAlchemy
    ├── aiosqlite (SQLite)
    └── asyncpg (PostgreSQL)

LangChain / LangGraph
    ├── openai
    ├── anthropic
    ├── google-generativeai
    └── ollama

python-pptx ──── PPT 解析
    └── Pillow

Playwright ──── 浏览器自动化
    └── httpx

LangChain ──── AI 编排
```

---

## 9. 项目运行方式

### 9.1 环境要求

| 要求 | 版本 | 说明 |
|------|------|------|
| Python | 3.11+ | 必需 |
| ffmpeg | 最新 | 视频导出必需 |
| Playwright Chromium | 最新 | PDF/导出必需 |
| LibreOffice | 最新 | PPT 导入预览（可选） |

### 9.2 本地运行（Windows）

```powershell
# 1. 克隆仓库
git clone https://github.com/kenydey/WiseDeck.git
cd WiseDeck

# 2. 安装 uv
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 3. 安装依赖
uv sync --extra dev

# 4. 配置环境变量
Copy-Item .env.example .env
# 编辑 .env，设置 SECRET_KEY 和 AI API Key

# 5. 安装 Playwright（可选）
uv run playwright install chromium

# 6. 启动服务
uv run python run.py

# 访问地址
# Web 界面: http://localhost:8000
# API 文档: http://localhost:8000/docs
# 健康检查: http://localhost:8000/health
```

### 9.3 Docker 运行

```bash
# 生产部署
docker compose up -d --build

# 开发模式（热重载）
docker compose -f docker-compose-dev.yaml up -d --build
```

### 9.4 应用入口点

| 入口 | 命令 | 功能 |
|------|------|------|
| `run.py` | `python run.py` | 主应用入口 |
| `wisedeck.main:main` | `uv run wisedeck` | CLI 入口 |
| `wisedeck.mcp.server:main` | `uv run wisedeck-mcp` | MCP 服务器 |

---

## 10. 配置说明

### 10.1 必需配置 [.env.example](file:///c:/dev/WiseDeck/.env.example)

```bash
# 安全密钥（必需）
SECRET_KEY=your-secure-secret-key

# AI 提供商（至少配置一个）
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

### 10.2 服务器配置

```bash
HOST=0.0.0.0
PORT=8000
WORKERS=2
RELOAD=false
```

### 10.3 数据库配置

```bash
# 默认 SQLite
DATABASE_URL=sqlite:///./wisedeck.db
CACHE_BACKEND=memory

# 生产 PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/wisedeck
CACHE_BACKEND=valkey
VALKEY_URL=valkey://localhost:6379
```

### 10.4 研究功能配置

```bash
TAVILY_API_KEY=your_tavily_api_key_here
SEARXNG_HOST=http://localhost:8888
RESEARCH_PROVIDER=tavily  # tavily, searxng, both
```

### 10.5 图像服务配置

```bash
ENABLE_IMAGE_SERVICE=true
IMAGE_USER_STORAGE_QUOTA_MB=100
PIXABAY_API_KEY=your_pixabay_api_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
SILICONFLOW_API_KEY=your_siliconflow_key_here
POLLINATIONS_API_KEY=your_pollinations_api_key_here
```

### 10.6 PPTX 导入配置

```bash
WISEDECK_SOFFICE_PATH=  # LibreOffice 路径（可选）
WISEDECK_NODE_BIN=     # Node.js 路径（可选）
WISEDECK_DISABLE_PPTX_READABLE_JSON=  # 禁用 pptxtojson
```

---

## 附录 A: 文件索引

### A.1 核心入口文件

| 文件路径 | 说明 |
|---------|------|
| [run.py](file:///c:/dev/WiseDeck/run.py) | 应用启动入口 |
| [main.py](file:///c:/dev/WiseDeck/src/wisedeck/main.py) | FastAPI 应用定义 |
| [pyproject.toml](file:///c:/dev/WiseDeck/pyproject.toml) | 项目配置 |

### A.2 模板相关文件

| 文件路径 | 说明 |
|---------|------|
| [template_import_service.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/template_import_service.py) | 模板导入服务 |
| [pptx_physical_structure.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/pptx_physical_structure.py) | PPTX 物理结构提取 |
| [pptx_slide_layout_hints.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/pptx_slide_layout_hints.py) | 布局提示提取 |
| [visual_dna_v2.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/visual_dna_v2.py) | 视觉 DNA 提取 |
| [template_mapping_builder.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/template_mapping_builder.py) | 映射规则构建 |
| [global_master_template_service.py](file:///c:/dev/WiseDeck/src/wisedeck/services/template/global_master_template_service.py) | 全局模板服务 |

### A.3 API 路由文件

| 文件路径 | 说明 |
|---------|------|
| [wisedeck_api.py](file:///c:/dev/WiseDeck/src/wisedeck/api/wisedeck_api.py) | 核心业务 API |
| [global_master_template_api.py](file:///c:/dev/WiseDeck/src/wisedeck/api/global_master_template_api.py) | 模板管理 API |
| [image_api.py](file:///c:/dev/WiseDeck/src/wisedeck/api/image_api.py) | 图片服务 API |
| [openai_compat.py](file:///c:/dev/WiseDeck/src/wisedeck/api/openai_compat.py) | OpenAI 兼容 API |

### A.4 数据库文件

| 文件路径 | 说明 |
|---------|------|
| [models.py](file:///c:/dev/WiseDeck/src/wisedeck/database/models.py) | 数据库模型 |
| [database.py](file:///c:/dev/WiseDeck/src/wisedeck/database/database.py) | 数据库连接 |
| [service.py](file:///c:/dev/WiseDeck/src/wisedeck/database/service.py) | 数据服务 |

---

## 附录 B: 关键常量

### B.1 标记名称

| 标记 | 说明 | 对应 OOXML 类型 |
|------|------|----------------|
| `PAGE_TITLE` | 页面标题 | TITLE, CTRTITLE |
| `SUBTITLE` | 副标题 | SUBTITLE |
| `CONTENT_AREA` | 内容区域 | BODY, OBJECT, PIC |
| `CHART_AREA` | 图表区域 | CHART |
| `TABLE_AREA` | 表格区域 | TBL, TABLE |

### B.2 工作流状态

| 状态 | 说明 |
|------|------|
| `draft` | 草稿 |
| `requirements_confirmed` | 需求已确认 |
| `outline_generated` | 大纲已生成 |
| `generating` | 生成中 |
| `completed` | 完成 |

---

*文档生成完毕，如需更新请重新运行代码分析。*
