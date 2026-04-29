// Extracted share/export helpers for project slides editor.

let pptxExportInProgress = false;
let pptxExportPollingTimer = null;

let pdfExportInProgress = false;
let pdfExportPollingTimer = null;

async function exportToPDF() {
    if (pdfExportInProgress) {
        showNotification('PDF导出正在进行中，请稍候...', 'warning');
        return;
    }

    pdfExportInProgress = true;
    const progressToast = showProgressToast('正在准备PDF导出任务...');
    updateProgressToast(progressToast, '正在准备导出文件...', 10);

    try {
        // 使用新的异步导出端点
        const response = await fetch(`/api/projects/${window.wisedeckEditorConfig.projectId}/export/pdf/async`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`服务返回异常(${response.status})`);
        }

        const contentType = response.headers.get('content-type') || '';
        let data = {};
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            throw new Error('服务器返回了未知的响应格式。');
        }

        if (data.status === 'processing' && data.task_id) {
            const slideCount = data.slide_count || '多个';
            updateProgressToast(progressToast, `PDF生成任务已启动（共${slideCount}页），正在后台处理...`, 15);
            await trackPdfExportTask(data.task_id, progressToast);
        } else if (data.status === 'already_processing' && data.task_id) {
            updateProgressToast(progressToast, '已有PDF任务在处理中，正在跟踪进度...', 20);
            await trackPdfExportTask(data.task_id, progressToast);
        } else if (data.download_url) {
            updateProgressToast(progressToast, '生成完成，正在下载...', 100);
            triggerFileDownload(data.download_url);
            closeProgressToast(progressToast);
            showNotification('PDF生成完成，正在下载...', 'success');
        } else {
            throw new Error(data.error || data.message || 'PDF导出请求未能启动。');
        }
    } catch (error) {
        console.error('PDF export error:', error);
        clearPdfExportPolling();
        closeProgressToast(progressToast);
        showNotification(`PDF导出失败: ${error.message || error}`, 'error');
    } finally {
        pdfExportInProgress = false;
        clearPdfExportPolling();
    }
}

function clearPdfExportPolling() {
    if (pdfExportPollingTimer) {
        clearTimeout(pdfExportPollingTimer);
        pdfExportPollingTimer = null;
    }
}

async function trackPdfExportTask(taskId, progressToast) {
    return new Promise((resolve, reject) => {
        const pollInterval = 2000;
        const maxAttempts = 1800; // 1 hour max wait (1800 * 2s)
        let attempts = 0;

        const poll = async () => {
            attempts += 1;
            try {
                const response = await fetch(`/api/wisedeck/tasks/${taskId}`);
                if (!response.ok) {
                    throw new Error(`任务状态查询失败(${response.status})`);
                }

                const data = await response.json();

                if (data.status === 'completed' && data.result && data.result.success) {
                    updateProgressToast(progressToast, 'PDF生成完成，正在准备下载...', 100);
                    clearPdfExportPolling();
                    setTimeout(() => closeProgressToast(progressToast), 400);
                    const downloadUrl = data.download_url || `/api/wisedeck/tasks/${taskId}/download`;
                    triggerFileDownload(downloadUrl);
                    showNotification('PDF生成完成，正在下载...', 'success');
                    resolve();
                    return;
                }

                if (data.status === 'failed') {
                    const errorMessage = data.error || (data.result && data.result.error) || 'PDF生成失败';
                    throw new Error(errorMessage);
                }

                // 显示进度信息
                const statusTextMap = {
                    pending: '任务已排队，等待开始...',
                    running: '正在生成PDF，请稍候...',
                };
                const message = statusTextMap[data.status] || 'PDF生成进行中，请稍候...';

                // 计算进度：使用服务器报告的进度（如果有）
                let progressValue = 15;
                if (typeof data.progress === 'number' && data.progress > 0) {
                    // 服务器返回的是0-100的进度
                    progressValue = Math.min(95, Math.round(15 + data.progress * 0.8));
                } else {
                    // 没有进度信息时，基于尝试次数估算
                    progressValue = Math.min(95, 15 + Math.round((attempts / 30) * 60));
                }

                updateProgressToast(progressToast, message, progressValue);
            } catch (pollError) {
                clearPdfExportPolling();
                reject(pollError);
                return;
            }

            if (attempts >= maxAttempts) {
                clearPdfExportPolling();
                reject(new Error('等待PDF生成超时，请稍后重试。'));
                return;
            }

            pdfExportPollingTimer = setTimeout(poll, pollInterval);
        };

        pdfExportPollingTimer = setTimeout(poll, pollInterval);
    });
}



function exportToPDFClientSide() {
    // 显示提示信息
    // showNotification('正在打开客户端PDF导出页面...', 'info');

    // 打开客户端PDF导出页面（原html2pdf.js方式）
    // window.open(`/api/projects/${window.wisedeckEditorConfig.projectId}/export/pdf?fallback=true`, '_blank');
}

let structuredPptxExportInProgress = false;

function parseAttachmentFilename(contentDisposition) {
    if (!contentDisposition) {
        return null;
    }
    const star = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (star && star[1]) {
        try {
            return decodeURIComponent(star[1].trim().replace(/^"+|"+$/g, ''));
        } catch (e) {
            return star[1].trim();
        }
    }
    const quoted = contentDisposition.match(/filename="([^"]+)"/i);
    if (quoted && quoted[1]) {
        return quoted[1].trim();
    }
    const plain = contentDisposition.match(/filename=([^;\s]+)/i);
    return plain && plain[1] ? plain[1].trim() : null;
}

/**
 * Synchronous GET → PPTX file (native charts when outline has chart_config).
 * Does not use /api/wisedeck/tasks polling.
 *
 * Supported modes (API): auto | render | stable | python — stable/python removed from toolbar but remain for integrations/tests.
 */
async function exportToStructuredPPTX(options = {}) {
    if (structuredPptxExportInProgress) {
        showNotification('结构化 PPTX 导出正在进行中，请稍候...', 'warning');
        return;
    }
    structuredPptxExportInProgress = true;
    const progressToast = showProgressToast('正在生成结构化 PPTX（可编辑图表）...');
    updateProgressToast(progressToast, '正在请求服务器...', 15);
    try {
        const rawMode = options && options.mode ? String(options.mode) : '';
        let mode = rawMode === 'render'
            || rawMode === 'python'
            || rawMode === 'stable'
            || rawMode === 'auto'
            || rawMode === 'homomorphic'
            || rawMode === 'homomorphic_editable'
            ? rawMode
            : '';

        // Default behavior (no explicit mode): export with the SAME client PPTX template, then
        // merge native editable charts on the server (python-pptx) via /export/pptx-merge-native-charts.
        // This path is the only one that guarantees “client template + editable charts”.
        const isDefaultEntry = !mode || mode === 'auto';
        if (isDefaultEntry) {
            try {
                if (typeof exportSlidesToPptxClient === 'function') {
                    updateProgressToast(progressToast, '正在使用客户端模板导出并合并可编辑图表...', 18);
                    closeProgressToast(progressToast);
                    // dom-to-pptx → upload → merge-native-charts → download
                    await exportSlidesToPptxClient({ mergeNativeCharts: true });
                    return;
                }
            } catch (e) {
                // Fallback to server export below.
                console.warn('Client template export+merge failed, falling back to server structured export:', e);
            }
        }

        // Fallback: server structured export (kept for render mode and as safety net).
        // Note: Windows can fail the default server structured export path with `[Errno 22] Invalid argument`,
        // so we prefer client-export+merge above. If we reach here without explicit mode, use python-only
        // to avoid the known failure mode.
        if (!mode) {
            const platform = (typeof navigator !== 'undefined' && navigator.platform) ? String(navigator.platform) : '';
            const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? String(navigator.userAgent) : '';
            const isWindows = /win/i.test(platform) || /windows/i.test(ua);
            if (isWindows) {
                mode = 'python';
            }
        }
        const baseUrl = `/api/projects/${window.wisedeckEditorConfig.projectId}/export/structured-pptx`;
        const url = mode && mode !== 'auto' ? `${baseUrl}?mode=${encodeURIComponent(mode)}` : baseUrl;
        const response = await fetch(url);
        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            let detail = `服务返回异常(${response.status})`;
            if (contentType.includes('application/json')) {
                try {
                    const errBody = await response.json();
                    const d = errBody.detail;
                    if (Array.isArray(d)) {
                        detail = d.map((item) => (item && (item.msg || item.message)) || JSON.stringify(item)).join('; ');
                    } else if (typeof d === 'string') {
                        detail = d;
                    } else if (d != null) {
                        detail = String(d);
                    } else {
                        detail = errBody.message || detail;
                    }
                } catch (e) {
                    /* ignore */
                }
            } else {
                try {
                    const text = await response.text();
                    if (text) {
                        detail = text.slice(0, 500);
                    }
                } catch (e) {
                    /* ignore */
                }
            }
            throw new Error(detail);
        }

        if (!contentType.includes('application/vnd.openxmlformats-officedocument') && !contentType.includes('octet-stream')) {
            throw new Error('服务器返回了非 PPTX 的响应格式。');
        }

        const blob = await response.blob();
        const fromHeader = parseAttachmentFilename(response.headers.get('Content-Disposition'));
        const fallbackTitle = (window.wisedeckEditorConfig && window.wisedeckEditorConfig.exportTitle) || 'presentation';
        const filename = fromHeader || `${fallbackTitle}_structured.pptx`;

        updateProgressToast(progressToast, '生成完成，正在下载...', 100);
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);

        closeProgressToast(progressToast);
        showNotification('结构化 PPTX 下载已开始', 'success');
    } catch (error) {
        console.error('Structured PPTX export error:', error);
        closeProgressToast(progressToast);
        showNotification(`结构化 PPTX 导出失败: ${error.message || error}`, 'error');
    } finally {
        structuredPptxExportInProgress = false;
    }
}

async function exportToPPTX() {
    if (pptxExportInProgress) {
        showNotification('PPTX导出正在进行中，请稍候...', 'warning');
        return;
    }

    pptxExportInProgress = true;
    const progressToast = showProgressToast('正在准备PPTX导出任务...');
    updateProgressToast(progressToast, '正在准备导出文件...', 10);

    try {
        const response = await fetch(`/api/projects/${window.wisedeckEditorConfig.projectId}/export/pptx`);
        if (!response.ok) {
            throw new Error(`服务返回异常(${response.status})`);
        }

        const contentType = response.headers.get('content-type') || '';
        let data = {};
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            throw new Error('服务器返回了未知的响应格式。');
        }

        if (data.status === 'processing' && data.task_id) {
            updateProgressToast(progressToast, 'PPTX转换任务已启动，正在后台处理...', 20);
            await trackPptxExportTask(data.task_id, progressToast);
        } else if (data.download_url) {
            updateProgressToast(progressToast, '转换完成，正在下载...', 100);
            triggerFileDownload(data.download_url);
            closeProgressToast(progressToast);
            showNotification('PPTX转换完成，正在下载...', 'success');
        } else {
            throw new Error(data.error || data.message || 'PPTX导出请求未能启动。');
        }
    } catch (error) {
        console.error('PPTX export error:', error);
        clearPptxExportPolling();
        closeProgressToast(progressToast);
        showNotification(`PPTX导出失败: ${error.message || error}`, 'error');
    } finally {
        pptxExportInProgress = false;
        clearPptxExportPolling();
    }
}

function clearPptxExportPolling() {
    if (pptxExportPollingTimer) {
        clearTimeout(pptxExportPollingTimer);
        pptxExportPollingTimer = null;
    }
}

async function trackPptxExportTask(taskId, progressToast, options = {}) {
    return new Promise((resolve, reject) => {
        const pollInterval = 2000;
        const maxAttempts = 3000;
        let attempts = 0;
        const startProgress = Number.isFinite(options.startProgress) ? options.startProgress : 20;
        const maxInProgress = Number.isFinite(options.maxInProgress) ? options.maxInProgress : 95;

        const poll = async () => {
            attempts += 1;
            try {
                const response = await fetch(`/api/wisedeck/tasks/${taskId}`);
                if (!response.ok) {
                    throw new Error(`任务状态查询失败(${response.status})`);
                }

                const data = await response.json();

                if (data.status === 'completed' && data.result && data.result.success) {
                    updateProgressToast(progressToast, '转换完成，正在准备下载...', 100);
                    clearPptxExportPolling();
                    setTimeout(() => closeProgressToast(progressToast), 400);
                    const downloadUrl = data.download_url || `/api/wisedeck/tasks/${taskId}/download`;
                    triggerFileDownload(downloadUrl);
                    showNotification('PPTX转换完成，正在下载...', 'success');
                    resolve();
                    return;
                }

                if (data.status === 'failed') {
                    const errorMessage = data.error || (data.result && data.result.error) || 'PPTX转换失败';
                    throw new Error(errorMessage);
                }

                const statusTextMap = {
                    pending: options.pendingMessage || '任务已排队，等待开始...',
                    running: options.runningMessage || '正在转换PPTX，请稍候...',
                };
                const message = data.message
                    || (data.metadata && data.metadata.progress_message)
                    || statusTextMap[data.status]
                    || options.defaultMessage
                    || '转换任务进行中，请稍候...';

                let progressValue = startProgress + Math.round((attempts / maxAttempts) * Math.max(1, maxInProgress - startProgress));
                if (typeof data.progress === 'number') {
                    const reported = Math.round(data.progress);
                    progressValue = Math.max(startProgress, Math.min(maxInProgress, reported));
                }
                progressValue = Math.min(maxInProgress, progressValue);

                updateProgressToast(progressToast, message, progressValue);
            } catch (pollError) {
                clearPptxExportPolling();
                reject(pollError);
                return;
            }

            if (attempts >= maxAttempts) {
                clearPptxExportPolling();
                reject(new Error('等待PPTX转换超时，请稍后重试。'));
                return;
            }

            pptxExportPollingTimer = setTimeout(poll, pollInterval);
        };

        pptxExportPollingTimer = setTimeout(poll, pollInterval);
    });
}

function triggerFileDownload(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 将HTML页面转换为图片并导出为PPTX（使用后端Playwright截图）
async function exportToPPTXAsImages() {
    if (pptxExportInProgress) {
        showNotification('PPTX导出正在进行中，请稍候...', 'warning');
        return;
    }

    pptxExportInProgress = true;
    const progressToast = showProgressToast('正在准备图片导出...');

    try {
        // 使用slidesData数组
        if (!slidesData || slidesData.length === 0) {
            throw new Error('未找到幻灯片内容');
        }

        updateProgressToast(progressToast, `正在准备 ${slidesData.length} 张幻灯片...`, 10);

        // 提取每张幻灯片的HTML内容
        const slides = slidesData.map((slide, index) => ({
            index: index,
            html_content: slide.html_content,
            title: slide.title || `幻灯片 ${index + 1}`
        }));

        updateProgressToast(progressToast, '正在发送到服务器进行高质量渲染...', 20);

        // 发送HTML内容到后端，让后端使用Playwright进行截图和生成PPTX
        const response = await fetch(`/api/projects/${window.wisedeckEditorConfig.projectId}/export/pptx-images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                slides: slides
            })
        });

        if (!response.ok) {
            throw new Error(`服务返回异常(${response.status})`);
        }

        const contentType = response.headers.get('content-type') || '';
        let data = {};
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            throw new Error('服务器返回了未知的响应格式。');
        }

        if (data.status === 'processing' && data.task_id) {
            updateProgressToast(progressToast, '图片PPTX生成任务已启动，正在后台处理...', 25);
            await trackPptxExportTask(data.task_id, progressToast, {
                startProgress: 25,
                maxInProgress: 97,
                pendingMessage: '图片导出任务已排队，等待开始...',
                runningMessage: '正在渲染幻灯片图片并生成PPTX...',
                defaultMessage: '图片导出任务进行中，请稍候...'
            });
        } else if (data.download_url) {
            updateProgressToast(progressToast, '转换完成，正在下载...', 100);
            triggerFileDownload(data.download_url);
            closeProgressToast(progressToast);
            showNotification('PPTX转换完成，正在下载...', 'success');
        } else {
            throw new Error(data.error || data.message || 'PPTX导出请求未能启动。');
        }

    } catch (error) {
        console.error('PPTX image export error:', error);
        clearPptxExportPolling();
        closeProgressToast(progressToast);
        showNotification(`图片导出失败: ${error.message || error}`, 'error');
    } finally {
        pptxExportInProgress = false;
        clearPptxExportPolling();
    }
}


function downloadHTML() {
    // 显示提示信息
    showNotification('正在准备HTML文件包...', 'info');

    // 创建下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = `/api/projects/${window.wisedeckEditorConfig.projectId}/export/html`;
    downloadLink.download = '';
    downloadLink.style.display = 'none';

    // 添加到页面并触发下载
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // 延迟显示成功消息
    setTimeout(() => {
        showNotification('HTML文件包下载已开始', 'success');
    }, 1000);
}

function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    // 根据类型设置背景色
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#212529';
            break;
        default:
            notification.style.backgroundColor = '#007bff';
    }

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function exportSingleSlideHTML() {
    hideContextMenu();
    if (contextMenuSlideIndex >= 0 && contextMenuSlideIndex < slidesData.length) {
        const slide = slidesData[contextMenuSlideIndex];
        if (slide && slide.html_content) {
            // Create a blob with the HTML content
            const blob = new Blob([slide.html_content], { type: 'text/html' });

            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `slide_${contextMenuSlideIndex + 1}_${slide.title || 'untitled'}.html`;

            // Trigger download
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Clean up
            URL.revokeObjectURL(url);

            alert(`第${contextMenuSlideIndex + 1}页已导出为HTML文件`);
        } else {
            alert('该幻灯片没有可导出的HTML内容');
        }
    }
}

async function showShareDialog() {
    try {
        // 显示加载提示
        showNotification('正在生成分享链接...', 'info');

        // 调用API生成分享链接
        const response = await fetch(`/api/projects/${window.wisedeckEditorConfig.projectId}/share/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('生成分享链接失败');
        }

        const result = await response.json();
        const shareUrl = `${window.location.origin}${result.share_url}`;
        const hasSpeechScripts = window.wisedeckEditorConfig.hasSpeechScripts;
const narrationLanguages = window.wisedeckEditorConfig.narrationLanguages;
const defaultNarrLang = (Array.isArray(narrationLanguages) && narrationLanguages.length)
    ? (narrationLanguages[0] || 'zh')
    : 'zh';
const narrationUrl = hasSpeechScripts
    ? `${shareUrl}?narration=1&language=${encodeURIComponent(defaultNarrLang)}`
    : '';

// 创建分享对话框
const modal = document.createElement('div');
modal.className = 'lp-share-modal';
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');

modal.innerHTML = `
            <div class="lp-share-modal-dialog">
                <div class="lp-share-modal-content">
                    <div class="lp-share-modal-header">
                        <div class="lp-share-modal-title">
                            <span class="lp-share-modal-icon"><i class="fas fa-share-alt"></i></span>
                            <span>分享链接</span>
                        </div>
                        <button type="button" class="lp-share-modal-close" aria-label="关闭分享弹窗">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="lp-share-modal-body">
                        <div class="lp-share-block">
                            <div class="lp-share-block-title"><i class="fas fa-link"></i><span>演示链接</span></div>
                            <div class="lp-share-url" id="lpShareUrlBox"></div>
                        </div>
                        <div class="lp-share-block" id="lpNarrationBlock" style="display:none">
                            <div class="lp-share-block-title"><i class="fas fa-microphone"></i><span>讲解链接</span></div>
                            <div class="lp-share-url" id="lpNarrationUrlBox"></div>
                        </div>
                        <div class="lp-share-actions" id="lpShareActions"></div>
                    </div>
                    <div class="lp-share-hint">
                        <i class="fas fa-shield-alt"></i><span>分享链接已启用，可随时禁用</span>
                    </div>
                </div>
            </div>
        `;

document.body.appendChild(modal);

// Fill URLs safely (avoid innerHTML injection).
const shareUrlBox = modal.querySelector('#lpShareUrlBox');
if (shareUrlBox) shareUrlBox.textContent = shareUrl;
const narrationUrlBox = modal.querySelector('#lpNarrationUrlBox');
if (narrationUrlBox) narrationUrlBox.textContent = narrationUrl;

// Actions
const actions = modal.querySelector('#lpShareActions');
const close = () => modal.remove();
const makeBtn = (text, iconClass, className, onClick) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    const icon = document.createElement('i');
    icon.className = iconClass;
    const label = document.createElement('span');
    label.textContent = text;
    btn.appendChild(icon);
    btn.appendChild(label);
    btn.addEventListener('click', onClick);
    return btn;
};

if (actions) {
    actions.appendChild(makeBtn('复制链接', 'fas fa-copy', 'speech-btn speech-btn-primary', () => copyShareUrl(shareUrl)));
    actions.appendChild(makeBtn('打开演示', 'fas fa-external-link-alt', 'speech-btn speech-btn-outline', () => openShareUrl(shareUrl)));

    if (hasSpeechScripts && narrationUrl) {
        const narrationBlock = modal.querySelector('#lpNarrationBlock');
        if (narrationBlock) narrationBlock.style.display = '';
        actions.appendChild(makeBtn('复制讲解链接', 'fas fa-microphone', 'speech-btn speech-btn-outline', () => copyShareUrl(narrationUrl)));
        actions.appendChild(makeBtn('打开讲解', 'fas fa-microphone', 'speech-btn speech-btn-outline', () => openShareUrl(narrationUrl)));
    }

    actions.appendChild(makeBtn('禁用分享', 'fas fa-ban', 'speech-btn lp-share-btn-danger', () => disableSharing()));
    actions.appendChild(makeBtn('关闭', 'fas fa-times', 'speech-btn speech-btn-secondary', () => close()));
}

// 点击背景关闭
modal.addEventListener('click', function (e) {
    if (e.target === modal) {
        close();
    }
});

// Close button
modal.querySelector('.lp-share-modal-close')?.addEventListener('click', close);

// Escape to close (one-shot per modal)
const onKeyDown = (e) => {
    if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', onKeyDown);
    }
};
document.addEventListener('keydown', onKeyDown);

showNotification('分享链接已生成', 'success');

    } catch (error) {
    console.error('Error generating share link:', error);
    showNotification('生成分享链接失败: ' + error.message, 'error');
}
}

async function disableSharing() {
    try {
        const response = await fetch(`/api/projects/${window.wisedeckEditorConfig.projectId}/share/disable`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('禁用分享失败');
        }

        // 关闭对话框
        document.querySelector('.lp-share-modal')?.remove();
        showNotification('分享已禁用', 'success');

    } catch (error) {
        console.error('Error disabling share:', error);
        showNotification('禁用分享失败: ' + error.message, 'error');
    }
}

function copyShareUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('分享链接已复制到剪贴板！', 'success');
    }).catch(() => {
        // 备用复制方法
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('分享链接已复制到剪贴板！', 'success');
    });
}

function openShareUrl(url) {
    window.open(url, '_blank');
}

// --- Client PPTX export options (UI) ---

const CLIENT_PPTX_MERGE_NATIVE_CHARTS_STORAGE_KEY = 'wisedeck_client_pptx_merge_native_charts';

function getClientPptxMergeNativeChartsPreference() {
    try {
        const v = localStorage.getItem(CLIENT_PPTX_MERGE_NATIVE_CHARTS_STORAGE_KEY);
        return v === '1' || v === 'true';
    } catch (_) {
        return false;
    }
}

function setClientPptxMergeNativeChartsPreference(enabled) {
    try {
        localStorage.setItem(CLIENT_PPTX_MERGE_NATIVE_CHARTS_STORAGE_KEY, enabled ? '1' : '0');
    } catch (_) { }
}

function openClientPptxExportDialog() {
    const modalEl = document.getElementById('clientPptxExportOptionsModal');
    const checkbox = document.getElementById('clientPptxMergeNativeChartsCheckbox');
    const confirmBtn = document.getElementById('clientPptxExportConfirmBtn');
    if (!modalEl || !checkbox || !confirmBtn || !window.bootstrap || !window.bootstrap.Modal) {
        // Fallback: if modal not available, keep old behavior.
        exportSlidesToPptxClient();
        return;
    }

    checkbox.checked = getClientPptxMergeNativeChartsPreference();

    const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    confirmBtn.onclick = async () => {
        const enabled = !!checkbox.checked;
        setClientPptxMergeNativeChartsPreference(enabled);
        modal.hide();
        await exportSlidesToPptxClient({ mergeNativeCharts: enabled });
    };

    modal.show();
}
