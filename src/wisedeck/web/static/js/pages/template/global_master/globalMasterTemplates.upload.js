export function createGlobalMasterTemplatesUpload({ state, apiClient, formatBytes, loadTemplates }) {
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
                setImportButtonBusy(true, '检查转换引擎…');
                busy = true;
                await checkOfficeEngineAvailable();

                setImportButtonBusy(true, '结构化导入…');
                const dataUrl = await readFileAsDataURL(file);
                const bundleMode =
                    document.getElementById('officeImportBundleMode')?.value || 'vertical_stack';
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
                        `从文件 ${file.name} 结构化导入（${conv.export_engine_used}）。` +
                        '含 pptx_readable / layout_package 契约；生成时可对齐占位符；HTML/SVG 供预览与导出。',
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
                if (Array.isArray(conv.warnings) && conv.warnings.length) {
                    importWarnings = conv.warnings.slice();
                    console.warn('模板导入警告', importWarnings);
                }
            } else if (isPdf) {
                importKind = 'pdf';
                if (file.size > 50 * 1024 * 1024) {
                    throw new Error('PDF 过大，请控制在 50MB 以内');
                }
                setImportButtonBusy(true, '解析 PDF…');
                busy = true;
                const dataUrl = await readFileAsDataURL(file);
                const conv = await apiClient.post('/api/global-master-templates/import/convert-pdf-template', {
                    filename: file.name,
                    data: dataUrl,
                    png_zoom: 2.0,
                    bundle_mode: 'vertical_stack',
                });
                importConvertResult = conv;
                const stem =
                    conv.suggested_template_name ||
                    file.name.replace(/\.pdf$/i, '');
                templateData = {
                    template_name: stem,
                    description:
                        `从 PDF ${file.name} 导入（引擎 ${conv.export_engine_used}）。` +
                        '此为视觉母版：PDF 无原生幻灯片占位结构；精细替换区建议优先使用 PPTX 导入。',
                    html_template: conv.html_template,
                    tags: ['导入', 'PDF', '视觉母版'],
                    is_default: false,
                };
                if (conv.svg_template) {
                    templateData.svg_template = conv.svg_template;
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
                    '。已保存 import_summary（含契约 / pptx_layout 等）。libreoffice_html 无 svg_template；svg_stack 会注入 {{…}} 占位并可有 svg_slide_xmls。';
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

    return {
        initImageUpload,
        clearUploadedImage,
        clearUploadedPptx,
        handleTemplateImport,
    };
}
