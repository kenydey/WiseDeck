export function createGlobalMasterTemplatesUpload({ state, apiClient, formatBytes, loadTemplates }) {

    const USE_LIGHTWEIGHT_IMPORT = true;

    function initImageUpload() {
        const imageUploadArea = document.getElementById('imageUploadArea');
        const pptxUploadArea = document.getElementById('pptxUploadArea');
        const dropzone = document.getElementById('uploadDropzone');
        const fileInput = document.getElementById('imageFileInput');
        const selectBtn = document.getElementById('selectImageBtn');
        const removeBtn = document.getElementById('removeImageBtn');
        const pptxFileInput = document.getElementById('pptxFileInput');
        const selectPptxBtn = document.getElementById('selectPptxBtn');
        const removePptxBtn = document.getElementById('removePptxBtn');
        const modeRadios = document.querySelectorAll('input[name="generation_mode"]');

        const updateReferenceUploadArea = (modeValue) => {
            const mode = String(modeValue || 'text_only');
            const showImage = mode === 'reference_style' || mode === 'exact_replica';
            const showPptx = mode === 'pptx_extract';
            if (imageUploadArea) {
                imageUploadArea.style.display = showImage ? 'block' : 'none';
            }
            if (pptxUploadArea) {
                pptxUploadArea.style.display = showPptx ? 'block' : 'none';
            }
        };

        modeRadios.forEach((radio) => {
            radio.addEventListener('change', () => {
                updateReferenceUploadArea(radio.value);
            });
        });
        updateReferenceUploadArea(document.querySelector('input[name="generation_mode"]:checked')?.value || 'text_only');

        if (selectBtn && fileInput) {
            selectBtn.addEventListener('click', () => fileInput.click());
        }
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
            });
        }
        if (removeBtn) {
            removeBtn.addEventListener('click', clearUploadedImage);
        }
        if (selectPptxBtn && pptxFileInput) {
            selectPptxBtn.addEventListener('click', () => pptxFileInput.click());
        }
        if (pptxFileInput) {
            pptxFileInput.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                if (file) handlePptxFile(file);
            });
        }
        if (removePptxBtn) {
            removePptxBtn.addEventListener('click', clearUploadedPptx);
        }
        if (dropzone) {
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('drag-over');
            });
            dropzone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropzone.classList.remove('drag-over');
            });
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('drag-over');
                const file = e.dataTransfer?.files?.[0];
                if (file) handleImageFile(file);
            });
        }
    }

    function handleImageFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            state.uploadedImage = {
                filename: file.name,
                size: file.size,
                type: file.type,
                data: e.target.result,
            };
            showImagePreview();
        };
        reader.readAsDataURL(file);
    }

    function handlePptxFile(file) {
        const lowerName = String(file?.name || '').toLowerCase();
        const isPptxMime = file?.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        const isPptMime =
            file?.type === 'application/vnd.ms-powerpoint' ||
            file?.type === 'application/mspowerpoint';
        const okExt = lowerName.endsWith('.pptx') || lowerName.endsWith('.ppt');
        if (!okExt && !isPptxMime && !isPptMime) {
            alert('请上传 .ppt 或 .pptx 文件');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            alert('演示文稿过大，请控制在 50MB 以内');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            let mime =
                file.type ||
                (lowerName.endsWith('.ppt')
                    ? 'application/vnd.ms-powerpoint'
                    : 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
            state.uploadedPptx = {
                filename: file.name,
                size: file.size,
                type: mime,
                data: e.target.result,
            };
            state.templateWorkspaceId = null;
            showPptxPreview();
        };
        reader.onerror = () => alert('读取 PPTX 文件失败');
        reader.readAsDataURL(file);
    }

    function showImagePreview() {
        const previewContainer = document.getElementById('imagePreviewContainer');
        const preview = document.getElementById('imagePreview');
        const filename = document.getElementById('imageFilename');
        const size = document.getElementById('imageSize');

        if (!state.uploadedImage || !previewContainer || !preview) return;

        preview.src = state.uploadedImage.data;
        previewContainer.style.display = 'block';
        if (filename) filename.textContent = state.uploadedImage.filename;
        if (size) size.textContent = formatBytes(state.uploadedImage.size);
    }

    function showPptxPreview() {
        const previewContainer = document.getElementById('pptxPreviewContainer');
        const filename = document.getElementById('pptxFilename');
        const size = document.getElementById('pptxSize');
        const hint = document.getElementById('pptxExtractHint');

        if (!state.uploadedPptx || !previewContainer) return;

        previewContainer.style.display = 'block';
        if (filename) filename.textContent = state.uploadedPptx.filename;
        if (size) size.textContent = formatBytes(state.uploadedPptx.size);
        if (hint) {
            hint.textContent =
                '此模式会先创建导入工作区（LibreOffice→PDF→PNG/SVG），推理时附带版式摘要与渲染图；保存模板时可合并工作区契约与矢量页。直接「导入模板」文件则默认先试 LibreOffice HTML，失败再 svg_stack。';
        }
    }

    function clearUploadedImage() {
        state.uploadedImage = null;
        const previewContainer = document.getElementById('imagePreviewContainer');
        if (previewContainer) previewContainer.style.display = 'none';
        const fileInput = document.getElementById('imageFileInput');
        if (fileInput) fileInput.value = '';
    }

    function clearUploadedPptx() {
        state.uploadedPptx = null;
        state.templateWorkspaceId = null;
        const previewContainer = document.getElementById('pptxPreviewContainer');
        if (previewContainer) previewContainer.style.display = 'none';
        const fileInput = document.getElementById('pptxFileInput');
        if (fileInput) fileInput.value = '';
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function setImportButtonBusy(busy, label) {
        const btn = document.getElementById('importTemplateBtn');
        if (!btn) return;
        if (busy) {
            if (btn.dataset.originalHtml === undefined) {
                btn.dataset.originalHtml = btn.innerHTML;
            }
            btn.disabled = true;
            btn.setAttribute('aria-busy', 'true');
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${label || '处理中…'}`;
        } else {
            btn.disabled = false;
            btn.removeAttribute('aria-busy');
            if (btn.dataset.originalHtml !== undefined) {
                btn.innerHTML = btn.dataset.originalHtml;
                delete btn.dataset.originalHtml;
            }
        }
    }

    async function checkOfficeEngineAvailable() {
        try {
            const status = await apiClient.get('/api/global-master-templates/import/office-engine-status');
            if (status && status.available === false) {
                const msg =
                    (status.error ? status.error + '\n\n' : '') +
                    '解决方法：\n' +
                    '1) 安装 LibreOffice（Windows 默认路径：C:\\Program Files\\LibreOffice\\program\\soffice.exe）；\n' +
                    '2) 或在 .env 设置 WISEDECK_SOFFICE_PATH 指向 soffice 可执行文件，然后重启服务。';
                throw new Error(msg);
            }
            return status;
        } catch (err) {
            if (err && err.status === 404) {
                return null;
            }
            throw err;
        }
    }

    async function handleTemplateImport(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        let busy = false;
        try {
            const lower = String(file.name || '').toLowerCase();
            const isOffice =
                lower.endsWith('.ppt') ||
                lower.endsWith('.pptx') ||
                file.type === 'application/vnd.ms-powerpoint' ||
                file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            const isPdf = lower.endsWith('.pdf') || file.type === 'application/pdf';

            let templateData;
            let importWarnings = [];
            /** @type {'office'|'pdf'|null} */
            let importKind = null;
            /** @type {any} */
            let importConvertResult = null;
            if (isOffice) {
                importKind = 'office';
                if (file.size > 50 * 1024 * 1024) {
                    throw new Error('演示文稿过大，请控制在 50MB 以内');
                }

                const lower = String(file.name || '').toLowerCase();
                const isPptx = lower.endsWith('.pptx');

                if (USE_LIGHTWEIGHT_IMPORT && isPptx) {
                    setImportButtonBusy(true, '轻量级导入…');
                    busy = true;
                    const dataUrl = await readFileAsDataURL(file);
                    
                    try {
                        const lightweightResult = await apiClient.post('/api/global-master-templates/import/lightweight-pptx', {
                            filename: file.name,
                            data: dataUrl,
                        });
                        
                        const template = lightweightResult.template || {};
                        const stem = template.template_name || file.name.replace(/\.pptx$/i, '');
                        const htmlTemplate = template.html_template || lightweightResult.preview_html || '';
                        
                        const tags = template.tags || ['导入', 'PPTX'];
                        if (htmlTemplate) tags.push('完整模板');
                        const layoutCount = template.layouts?.length || lightweightResult.config?.layouts?.length || 0;
                        if (layoutCount >= 5) tags.push('多布局');
                        
                        templateData = {
                            template_name: template.template_name || stem,
                            description: template.description || `从 PPTX 文件 ${file.name} 轻量级导入。纯 python-pptx 解析，无需外部依赖。`,
                            html_template: htmlTemplate,
                            tags: tags,
                            is_default: false,
                            import_summary: {
                                source: 'lightweight_pptx_import',
                                schema_version: 2,
                                layout_count: layoutCount,
                                placeholder_markers: template.placeholder_markers || lightweightResult.config?.template_contract?.placeholder_markers || [],
                                slide_dimensions: template.slide_dimensions || lightweightResult.config?.slide_dimensions,
                                background: template.background || lightweightResult.config?.background,
                                font_styles: lightweightResult.config?.font_styles,
                            },
                            style_config: {
                                colors: template.theme_colors || lightweightResult.config?.theme_colors,
                                fonts: template.fonts || lightweightResult.config?.fonts,
                                layouts: template.layouts || lightweightResult.config?.layouts,
                                background: template.background || lightweightResult.config?.background,
                                font_styles: lightweightResult.config?.font_styles,
                                responsive_config: lightweightResult.config?.responsive_config,
                            },
                        };
                        
                        importConvertResult = { export_engine_used: 'python-pptx-lightweight-v2' };
                    } catch (lightweightErr) {
                        console.warn('轻量级导入失败，回退到 LibreOffice:', lightweightErr);
                        setImportButtonBusy(true, '检查转换引擎…');
                        await checkOfficeEngineAvailable();
                        setImportButtonBusy(true, '结构化导入…');
                        const conv = await apiClient.post('/api/global-master-templates/import/convert-office-template', {
                            filename: file.name,
                            data: dataUrl,
                            prefer_libreoffice_html: true,
                            fallback_to_svg_stack: true,
                            bundle_mode: document.getElementById('officeImportBundleMode')?.value || 'per_slide',
                        });
                        importConvertResult = conv;
                        const stem = conv.suggested_template_name || file.name.replace(/\.(pptx|ppt)$/i, '');
                        templateData = {
                            template_name: stem,
                            description: `从文件 ${file.name} 结构化导入（${conv.export_engine_used}）`,
                            html_template: conv.html_template,
                            tags: ['导入', '结构化母版'],
                            is_default: false,
                        };
                        if (conv.svg_template) templateData.svg_template = conv.svg_template;
                        if (conv.import_summary) templateData.import_summary = conv.import_summary;
                        if (conv.template_contract) {
                            templateData.import_summary = templateData.import_summary || {};
                            templateData.import_summary.template_contract = conv.template_contract;
                        }
                        if (Array.isArray(conv.warnings) && conv.warnings.length) {
                            importWarnings = conv.warnings.slice();
                        }
                    }
                } else {
                    setImportButtonBusy(true, '检查转换引擎…');
                    busy = true;
                    await checkOfficeEngineAvailable();

                    setImportButtonBusy(true, '结构化导入…');
                    const dataUrl = await readFileAsDataURL(file);
                    setImportButtonBusy(true, '提取风格基因…');
                    let extractedStyle = null;
                    try {
                        extractedStyle = await apiClient.post('/api/template/extract', {
                            filename: file.name,
                            data: dataUrl,
                        });
                    } catch (e) {
                        console.warn('风格提取失败（不影响导入）', e);
                    }
                    const bundleMode =
                        document.getElementById('officeImportBundleMode')?.value || 'per_slide';
                    const conv = await apiClient.post('/api/global-master-templates/import/convert-office-template', {
                        filename: file.name,
                        data: dataUrl,
                        prefer_libreoffice_html: true,
                        fallback_to_svg_stack: true,
                        bundle_mode: bundleMode,
                    });
                    importConvertResult = conv;
                    const stem =
                        conv.suggested_template_name ||
                        file.name.replace(/\.(pptx|ppt)$/i, '');
                    templateData = {
                        template_name: stem,
                        description:
                            `从文件 ${file.name} 结构化导入（${conv.export_engine_used}），已保存为 1 条全局母版。` +
                            '多页在 import_summary / template_contract；列表预览默认多为第 1 页；生成时可对齐占位符。',
                        html_template: conv.html_template,
                        tags: ['导入', '结构化母版'],
                        is_default: false,
                    };
                    if (conv.svg_template) {
                        templateData.svg_template = conv.svg_template;
                    }
                    const importSummary = {};
                    if (conv.import_summary && typeof conv.import_summary === 'object') {
                        Object.assign(importSummary, conv.import_summary);
                    }
                    if (conv.template_contract && typeof conv.template_contract === 'object') {
                        importSummary.template_contract = conv.template_contract;
                    }
                    if (Object.keys(importSummary).length) {
                        templateData.import_summary = importSummary;
                    }
                    if (extractedStyle && extractedStyle.success !== false) {
                        templateData.style_config = {
                            style_id: extractedStyle.style_id,
                            custom_style_url: extractedStyle.custom_style_url,
                            asset_manifest_url: extractedStyle.asset_manifest_url,
                            palette: extractedStyle.summary?.paletteTop5,
                            typography: extractedStyle.summary?.fontPair,
                        };
                    }
                    if (Array.isArray(conv.warnings) && conv.warnings.length) {
                        importWarnings = conv.warnings.slice();
                        console.warn('模板导入警告', importWarnings);
                    }
                }
            } else if (isPdf) {
                importKind = 'pdf';
                if (file.size > 50 * 1024 * 1024) {
                    throw new Error('PDF 过大，请控制在 50MB 以内');
                }
                setImportButtonBusy(true, '解析 PDF…');
                busy = true;
                const dataUrl = await readFileAsDataURL(file);
                const conv = await apiClient.post('/api/global-master-templates/import/unified-pdf', {
                    filename: file.name,
                    data: dataUrl,
                    png_zoom: 2.0,
                    bundle_mode: 'per_slide',
                });
                importConvertResult = conv;
                
                const tmpl = conv.template || {};
                const stem = tmpl.template_name || file.name.replace(/\.pdf$/i, '');
                const tags = tmpl.tags || ['导入', 'PDF', '视觉模板'];
                
                templateData = {
                    template_name: stem,
                    description: tmpl.description || `从 PDF ${file.name} 导入。PDF 视觉模板，包含 ${conv.slide_count || 1} 页。`,
                    html_template: tmpl.html_template || conv.preview_html || conv.html_template,
                    tags: tags,
                    is_default: false,
                };
                if (conv.svg_template) {
                    templateData.svg_template = conv.svg_template;
                }
                if (conv.slide_count) {
                    templateData.slide_count = conv.slide_count;
                }
                if (conv.import_summary && typeof conv.import_summary === 'object') {
                    templateData.import_summary = conv.import_summary;
                }
                if (Array.isArray(conv.warnings) && conv.warnings.length) {
                    importWarnings = conv.warnings.slice();
                    console.warn('模板导入警告', importWarnings);
                }
            } else {
                const content = await readFileContent(file);
                if (file.name.endsWith('.json')) {
                    templateData = JSON.parse(content);
                } else if (file.name.endsWith('.html')) {
                    templateData = {
                        template_name: file.name.replace('.html', ''),
                        description: `从文件 ${file.name} 导入`,
                        html_template: content,
                        tags: ['导入'],
                        is_default: false,
                    };
                } else {
                    throw new Error('请选择 .json、.html、.pdf、.ppt 或 .pptx 文件');
                }
            }

            if (!templateData.template_name || !templateData.html_template) {
                throw new Error('文件缺少模板名称或HTML内容');
            }

            if (typeof templateData.tags === 'string') {
                templateData.tags = templateData.tags.split(',').map((t) => t.trim()).filter(Boolean);
            }
            if (!Array.isArray(templateData.tags)) {
                templateData.tags = [];
            }

            if (importKind === 'office' || importKind === 'pdf') {
                setImportButtonBusy(true, '保存模板…');
            }
            await apiClient.post('/api/global-master-templates/', templateData);
            event.target.value = '';
            loadTemplates(1);
            /** @type {string} */
            let provenanceNote = '';
            if (importKind === 'office') {
                const engine =
                    typeof importConvertResult?.export_engine_used === 'string'
                        ? importConvertResult.export_engine_used
                        : '';
                provenanceNote =
                    '引擎：' +
                    (engine || '未知') +
                    '。仅 1 条模板：多页在 import_summary（如 svg_slide_xmls、html_slide_fragments）与契约中；预览多为第 1 页。请关注页数不一致类警告。';
            } else if (importKind === 'pdf') {
                provenanceNote =
                    'PDF 导入已写入 import_summary（template_provenance=pdf_raster_svg_stack）；不含 PPTX 占位符映射。';
            }
            if (importWarnings.length) {
                alert(
                    '模板导入成功（包含警告）：\n- ' +
                        importWarnings.join('\n- ') +
                        (provenanceNote ? '\n\n' + provenanceNote : '')
                );
            } else {
                alert('模板导入成功' + (provenanceNote ? '。\n\n' + provenanceNote : ''));
            }
        } catch (error) {
            console.error('导入失败', error);
            alert('导入模板失败: ' + (error?.message || error));
            event.target.value = '';
        } finally {
            if (busy) setImportButtonBusy(false);
        }
    }

    function readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    function generateFallbackPreviewHtml(templateConfig) {
        const themeColors = templateConfig.theme_colors || {};
        const fonts = templateConfig.fonts || {};
        const layouts = templateConfig.layouts || [];
        const bgColor = themeColors.background || '#FFFFFF';
        const titleColor = themeColors.primary || '#4472C4';
        const titleFont = fonts.title || 'Arial';
        const bodyFont = fonts.body || 'Calibri';

        const layout = layouts[0] || { placeholders: [] };
        const placeholders = layout.placeholders || [];

        let placeholderHtml = '';
        placeholders.forEach((ph) => {
            const bbox = ph.bbox_ratio || [0, 0, 0, 0];
            const left = Math.round((bbox[0] || 0) * 100);
            const top = Math.round((bbox[1] || 0) * 100);
            const width = Math.round((bbox[2] || 0) * 100);
            const height = Math.round((bbox[3] || 0) * 100);
            
            const isTitle = ph.type === 'PAGE_TITLE';
            const isSubtitle = ph.type === 'SUBTITLE';
            const phBgColor = isTitle || isSubtitle ? 'transparent' : 'rgba(68, 114, 196, 0.1)';
            const phBorderColor = isTitle || isSubtitle ? 'transparent' : 'rgba(68, 114, 196, 0.3)';
            const phTextColor = isTitle ? titleColor : isSubtitle ? '#666666' : '#333333';
            const phFontFamily = isTitle || isSubtitle ? titleFont : bodyFont;
            const phFontSize = isTitle ? '18px' : isSubtitle ? '14px' : '12px';
            const phLabel = isTitle ? '标题' : isSubtitle ? '副标题' : '内容';

            placeholderHtml += `
                <div style="
                    position:absolute;
                    left:${left}%;
                    top:${top}%;
                    width:${width}%;
                    height:${height}%;
                    background:${phBgColor};
                    border:1px dashed ${phBorderColor};
                    border-radius:4px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-family:${phFontFamily}, sans-serif;
                    font-size:${phFontSize};
                    color:${phTextColor};
                    overflow:hidden;
                    box-sizing:border-box;
                ">
                    <span style="opacity:0.5;">${phLabel}</span>
                </div>
            `;
        });

        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>模板预览</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { 
            margin: 0; 
            padding: 0; 
            width: 100%; 
            height: 100%; 
            overflow: hidden;
        }
        body {
            background: ${bgColor};
            font-family: ${bodyFont}, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .slide-container {
            position: relative;
            width: 1280px;
            height: 720px;
            background: ${bgColor};
        }
    </style>
</head>
<body>
    <div class="slide-container">
        ${placeholderHtml}
    </div>
</body>
</html>`;
    }

    return {
        initImageUpload,
        clearUploadedImage,
        clearUploadedPptx,
        handleTemplateImport,
    };
}
