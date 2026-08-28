/**
 * Full Editor Integration - embedded PPTist overlay on slides editor.
 */

let pptxBridgeBusy = false;

const PPTX_BRIDGE_CACHE_TTL_MS = 5 * 60 * 1000;
let pptxBridgeCache = { fingerprint: '', blob: null, ts: 0 };

function computeSlidesDataFingerprint(slides) {
    if (!Array.isArray(slides)) return '';
    let sum = 0;
    for (let i = 0; i < slides.length; i++) {
        const h = slides[i] && slides[i].html_content;
        sum += typeof h === 'string' ? h.length : 0;
    }
    return `${slides.length}:${sum}`;
}

function pptxBridgeCacheValidForSlides(slides) {
    const fp = computeSlidesDataFingerprint(slides);
    if (!pptxBridgeCache.blob || pptxBridgeCache.fingerprint !== fp) return false;
    if (Date.now() - pptxBridgeCache.ts > PPTX_BRIDGE_CACHE_TTL_MS) return false;
    return true;
}

function rememberPptxBridgeBlob(blob, slides) {
    if (!(blob instanceof Blob)) return;
    pptxBridgeCache = { fingerprint: computeSlidesDataFingerprint(slides), blob, ts: Date.now() };
}

async function seedSlidesFromClientPptxBlob(projectId, pptxBlob) {
    const form = new FormData();
    form.append('file', pptxBlob, 'wisedeck-vector-seed.pptx');
    const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}/ssot/seed-from-client-pptx`, {
        method: 'POST',
        body: form,
        credentials: 'include',
    });
    let body = {};
    try { body = await res.json(); } catch (_) { body = {}; }
    if (!res.ok) {
        const detail = body.detail !== undefined ? body.detail : body.error || body.message;
        const msg = typeof detail === 'string' ? detail : detail ? JSON.stringify(detail) : `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return body;
}

async function runPptxBridgePipeline(projectId, opts) {
    const options = opts || {};
    const preferCache = !!options.preferCache;
    const prepareFullEditor = !!options.prepareFullEditor;
    const exportFn = typeof window.exportSlidesToPptxClient === 'function' ? window.exportSlidesToPptxClient : typeof exportSlidesToPptxClient === 'function' ? exportSlidesToPptxClient : null;
    if (!exportFn) return { ok: false, error: '\u5ba2\u6237\u7aef\u5bfc\u51fa\u6a21\u5757\u672a\u52a0\u8f7d\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5' };
    const fpSlides = Array.isArray(slidesData) ? slidesData : [];
    let pptxBlob = null;
    if (preferCache && pptxBridgeCacheValidForSlides(fpSlides)) {
        pptxBlob = pptxBridgeCache.blob;
        if (typeof showNotification === 'function') showNotification('\u590d\u7528\u5df2\u51c6\u5907\u7684\u5408\u5e76 PPTX\uff0c\u6b63\u5728\u4e0a\u4f20\u5e76\u89e3\u6790\uff08pptxtojson\uff09\u2026', 'info');
    } else {
        pptxBlob = await exportFn({ vectorSeedSync: true, mergeNativeCharts: true, prepareFullEditor });
        if (pptxBlob && typeof showNotification === 'function') showNotification('\u6b63\u5728\u4e0a\u4f20 PPTX \u5e76\u89e3\u6790\u4e3a\u77e2\u91cf\uff08pptxtojson\uff09\u2026', 'info');
    }
    if (!pptxBlob || !(pptxBlob instanceof Blob)) {
        return { ok: false, error: prepareFullEditor ? '\u672a\u80fd\u751f\u6210\u53ef\u7528\u7684\u5408\u5e76\u540e PPTX\uff0c\u5df2\u53d6\u6d88\u6253\u5f00\u5b8c\u6574\u7f16\u8f91' : null };
    }
    try {
        const body = await seedSlidesFromClientPptxBlob(projectId, pptxBlob);
        rememberPptxBridgeBlob(pptxBlob, fpSlides);
        const toastMessage = options.toastOnSuccess && `\u77e2\u91cf\u5df2\u5bf9\u9f50\uff08pptx_bridge\uff0c${body.seeded_slides != null ? body.seeded_slides : '?'} \u9875\uff09`;
        const data = await refreshSlidesData(projectId, {
            suppressToast: !options.toastOnSuccess,
            toastMessage: toastMessage || undefined,
            returnPayload: true,
            warnNeedsBackfill: options.warnNeedsBackfill !== false,
            applyToEditor: !prepareFullEditor,
        });
        const slidesPayload = data && Array.isArray(data.slides_data) && data.slides_data.length > 0 ? data.slides_data : fpSlides;
        return { ok: true, body, data, slidesPayload, mergedPptxBlob: pptxBlob, needs_elements_backfill: !!(data && data.needs_elements_backfill) };
    } catch (e) {
        console.error('[runPptxBridgePipeline]', e);
        return { ok: false, error: e.message || String(e) };
    }
}

function getProjectIdFromUrl() {
    const match = window.location.pathname.match(/\/projects\/([^\/]+)/);
    return match ? match[1] : null;
}

function stripResolvedPreviewFromSlides(slides) {
    if (!Array.isArray(slides)) return slides;
    return slides.map((s) => {
        if (!s || typeof s !== 'object') return s;
        const o = Object.assign({}, s);
        delete o.resolved_preview_html;
        return o;
    });
}

function restoreSlidesVisualSnapshotToEditor() {
    const snap = window.__slidesVisualSnapshotBeforeFullEditor;
    if (!Array.isArray(slidesData) || !Array.isArray(snap) || !snap.length) return false;
    const restored = stripResolvedPreviewFromSlides(
        slidesData.map((slide, i) => {
            const vis = snap[i] || {};
            const out = Object.assign({}, slide);
            for (const k of WDS_VISUAL_SNAPSHOT_KEYS) {
                if (vis[k] !== undefined) out[k] = vis[k];
            }
            return out;
        })
    );
    slidesData = restored;
    window.slidesData = restored;
    window.projectSlidesData = restored;
    if (typeof updateSlideThumbnails === 'function') updateSlideThumbnails(restored);
    const idx =
        typeof currentSlideIndex === 'number' && currentSlideIndex >= 0 && currentSlideIndex < restored.length
            ? currentSlideIndex
            : 0;
    const cur = restored[idx] || restored[0];
    if (cur && typeof updateCurrentSlidePreview === 'function') updateCurrentSlidePreview(cur);
    if (typeof refreshMainEditorStrictPixelPreview === 'function') refreshMainEditorStrictPixelPreview();
    const codeEditor = document.getElementById('codeEditor');
    if (codeEditor && cur) {
        const html = slideHtmlForCodeEditor(cur);
        if (
            typeof codeMirrorEditor !== 'undefined' &&
            codeMirrorEditor &&
            typeof isCodeMirrorInitialized !== 'undefined' &&
            isCodeMirrorInitialized
        ) {
            codeMirrorEditor.setValue(html);
        } else {
            codeEditor.value = html;
        }
    }
    if (typeof selectSlide === 'function') selectSlide(idx);
    return true;
}

function closeEmbeddedFullEditor(options) {
    const opts = options || {};
    if (opts.restoreVisualSnapshot) {
        restoreSlidesVisualSnapshotToEditor();
    }
    const overlay = document.getElementById('embeddedFullEditorOverlay');
    const iframe = document.getElementById('embeddedPptistIframe');
    if (window.__embeddedPptistEditorInstance && typeof window.__embeddedPptistEditorInstance.destroy === 'function') {
        window.__embeddedPptistEditorInstance.destroy();
    }
    window.__embeddedPptistEditorInstance = null;
    try {
        delete window.__slidesVisualSnapshotBeforeFullEditor;
    } catch (_) {
        window.__slidesVisualSnapshotBeforeFullEditor = undefined;
    }
    if (iframe) iframe.src = 'about:blank';
    if (overlay) {
        overlay.classList.remove('is-visible');
        overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('embedded-full-editor-open');
}

const WDS_VISUAL_SNAPSHOT_KEYS = ['html_content', 'pptist_aligned_preview_html', 'slide_document', 'wds_aippt_v1'];

function captureSlidesVisualSnapshot(slides) {
    if (!Array.isArray(slides)) return [];
    return slides.map((s) => {
        if (!s || typeof s !== 'object') return {};
        const row = {};
        for (const k of WDS_VISUAL_SNAPSHOT_KEYS) {
            if (s[k] !== undefined) row[k] = s[k];
        }
        return row;
    });
}

function mergeSavedSlidesWithVisualSnapshot(savedSlides) {
    const snap = window.__slidesVisualSnapshotBeforeFullEditor;
    if (!Array.isArray(savedSlides) || !savedSlides.length) return savedSlides;
    if (!Array.isArray(snap) || !snap.length) return savedSlides;
    const isDegraded =
        typeof window.isDegradedPptistAlignedPreview === 'function'
            ? window.isDegradedPptistAlignedPreview
            : () => false;
    return savedSlides.map((slide, i) => {
        const vis = snap[i] || {};
        const merged = Object.assign({}, slide);
        const savedHtml = slide && slide.html_content;
        const savedAligned = slide && slide.pptist_aligned_preview_html;
        const htmlMissing = !savedHtml || !String(savedHtml).trim();
        const alignedDegraded = isDegraded(savedAligned);
        if (htmlMissing || alignedDegraded) {
            if (vis.html_content) merged.html_content = vis.html_content;
        }
        if (!savedAligned || !String(savedAligned).trim() || alignedDegraded) {
            if (vis.pptist_aligned_preview_html) merged.pptist_aligned_preview_html = vis.pptist_aligned_preview_html;
        }
        for (const k of ['slide_document', 'wds_aippt_v1']) {
            if (vis[k] !== undefined && vis[k] !== null) merged[k] = vis[k];
        }
        return merged;
    });
}

function slideHtmlForCodeEditor(slide) {
    if (!slide) return '';
    if (typeof window.slidePreviewHtml === 'function') return window.slidePreviewHtml(slide) || '';
    const aligned = slide.pptist_aligned_preview_html;
    if (typeof aligned === 'string' && aligned.trim()) return aligned;
    return slide.html_content || '';
}

async function syncMainPreviewFromFullEditorElements(projectId) {
    if (!projectId) return false;
    try {
        const res = await fetch(
            `/api/projects/${encodeURIComponent(projectId)}/slides/sync-visual-from-elements`,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sync_html_content: false, only_user_edit: true }),
            }
        );
        if (!res.ok) return false;
        const body = await res.json();
        if (body.slides_data && Array.isArray(body.slides_data)) {
            applyEmbeddedEditorSavedSlides(body.slides_data);
        }
        if (typeof showNotification === 'function') {
            showNotification('\u4e3b\u9884\u89c8\u5bf9\u9f50\u5feb\u7167\u5df2\u66f4\u65b0\uff08\u5927\u7eb2 HTML \u672a\u8986\u76d6\uff09', 'success');
        }
        return true;
    } catch (e) {
        console.warn('[syncMainPreviewFromFullEditorElements]', e);
        return false;
    }
}

function offerSyncMainPreviewAfterFullEditorSave(projectId) {
    const msg =
        '\u77e2\u91cf\u5df2\u4fdd\u5b58\u3002\u662f\u5426\u6839\u636e\u5b8c\u6574\u7f16\u8f91\u7ed3\u679c\u66f4\u65b0\u4e3b\u9884\u89c8\u5bf9\u9f50\u5feb\u7167\uff1f\uff08\u4e0d\u4f1a\u8986\u76d6\u5927\u7eb2 HTML\uff09';
    if (typeof window.confirm !== 'function') return;
    if (window.confirm(msg)) {
        void syncMainPreviewFromFullEditorElements(projectId);
    }
}

function applyEmbeddedEditorSavedSlides(savedSlides) {
    if (!Array.isArray(savedSlides) || savedSlides.length === 0) return;
    const merged = stripResolvedPreviewFromSlides(mergeSavedSlidesWithVisualSnapshot(savedSlides));
    slidesData = merged;
    window.slidesData = merged;
    if (typeof updateSlideThumbnails === 'function') updateSlideThumbnails(merged);
    const idx = typeof currentSlideIndex === 'number' && currentSlideIndex >= 0 && currentSlideIndex < merged.length ? currentSlideIndex : 0;
    const cur = merged[idx] || merged[0];
    if (cur && typeof updateCurrentSlidePreview === 'function') updateCurrentSlidePreview(cur);
    if (typeof refreshMainEditorStrictPixelPreview === 'function') refreshMainEditorStrictPixelPreview();
    const codeEditor = document.getElementById('codeEditor');
    if (codeEditor && cur) {
        const html = slideHtmlForCodeEditor(cur);
        if (typeof codeMirrorEditor !== 'undefined' && codeMirrorEditor && typeof isCodeMirrorInitialized !== 'undefined' && isCodeMirrorInitialized) {
            codeMirrorEditor.setValue(html);
        } else { codeEditor.value = html; }
    }
    window.projectSlidesData = merged;
    if (typeof selectSlide === 'function') selectSlide(idx);
}

function showEmbeddedFullEditorCloseDialog() {
    const editor = window.__embeddedPptistEditorInstance;
    if (!editor) { closeEmbeddedFullEditor(); return; }
    let dialog = document.getElementById('embeddedFullEditorCloseDialog');
    if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.id = 'embeddedFullEditorCloseDialog';
        dialog.className = 'embedded-full-editor-close-dialog';
        dialog.innerHTML = '<form method="dialog" class="embedded-full-editor-close-dialog__panel"><h3 class="embedded-full-editor-close-dialog__title">\u79bb\u5f00\u5b8c\u6574\u7f16\u8f91</h3><p class="embedded-full-editor-close-dialog__hint">\u662f\u5426\u5c06\u5f53\u524d\u4fee\u6539\u4fdd\u5b58\u5230\u5e7b\u706f\u7247\u7f16\u8f91\u5668\uff1f</p><div class="embedded-full-editor-close-dialog__actions"><button type="button" class="embedded-full-editor-btn embedded-full-editor-btn--ghost" data-action="cancel">\u53d6\u6d88</button><button type="button" class="embedded-full-editor-btn embedded-full-editor-btn--ghost" data-action="discard">\u4e0d\u4fdd\u5b58\u8fd4\u56de</button><button type="button" class="embedded-full-editor-btn embedded-full-editor-btn--primary" data-action="save">\u4fdd\u5b58\u5e76\u8fd4\u56de</button></div></form>';
        document.body.appendChild(dialog);
        dialog.addEventListener('click', (ev) => {
            const btn = ev.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            if (action === 'cancel') dialog.close('cancel');
            else if (action === 'discard') dialog.close('discard');
            else if (action === 'save') dialog.close('save');
        });
    }
    const onClose = async () => {
        dialog.removeEventListener('close', onClose);
        const choice = dialog.returnValue || 'cancel';
        if (choice === 'cancel') return;
        if (choice === 'discard') {
            closeEmbeddedFullEditor({ restoreVisualSnapshot: true });
            return;
        }
        if (choice === 'save') await editor.saveAndReturn();
    };
    dialog.addEventListener('close', onClose);
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
}

function slidesLikelyNeedDomPptxVectorSync(slides) {
    if (!Array.isArray(slides) || slides.length === 0) return false;
    return slides.some((s) => s && typeof s === 'object' && (s.elements_source || '') !== 'pptx_bridge');
}

async function syncVectorSlidesFromDomToPptx() {
    const projectId = getProjectIdFromUrl();
    if (!projectId) { alert('\u65e0\u6cd5\u83b7\u53d6\u9879\u76eeID'); return; }
    if (pptxBridgeBusy) {
        if (typeof showNotification === 'function') showNotification('\u77e2\u91cf\u51c6\u5907\u6b63\u5728\u8fdb\u884c\u4e2d\u2026', 'warning');
        return;
    }
    pptxBridgeBusy = true;
    try {
        const result = await runPptxBridgePipeline(projectId, { preferCache: false, prepareFullEditor: false, toastOnSuccess: true });
        if (!result.ok && result.error && typeof showNotification === 'function') showNotification(`\u77e2\u91cf\u540c\u6b65\u5931\u8d25: ${result.error}`, 'error');
    } finally { pptxBridgeBusy = false; }
}

async function openFullEditor() {
    const projectId = getProjectIdFromUrl();
    if (!projectId) { alert('\u65e0\u6cd5\u83b7\u53d6\u9879\u76eeID'); return; }
    const overlay = document.getElementById('embeddedFullEditorOverlay');
    const iframe = document.getElementById('embeddedPptistIframe');
    if (!overlay || !iframe) { alert('\u5d4c\u5165\u7f16\u8f91\u5668\u5bb9\u5668\u7f3a\u5931\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5'); return; }
    const EditorCls = window.PPTistIFrameEditor;
    if (typeof EditorCls !== 'function') { alert('\u5b8c\u6574\u7f16\u8f91\u5668\u811a\u672c\u672a\u52a0\u8f7d\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5'); return; }
    if (pptxBridgeBusy) {
        if (typeof showNotification === 'function') showNotification('\u77e2\u91cf\u51c6\u5907\u6b63\u5728\u8fdb\u884c\u4e2d\u2026', 'warning');
        return;
    }
    pptxBridgeBusy = true;
    try {
        window.__slidesVisualSnapshotBeforeFullEditor = captureSlidesVisualSnapshot(
            Array.isArray(slidesData) ? slidesData : []
        );
        if (typeof showNotification === 'function') showNotification('\u6b63\u5728\u4e3a\u5b8c\u6574\u7f16\u8f91\u51c6\u5907\u77e2\u91cf\u2026', 'info');
        const prep = await runPptxBridgePipeline(projectId, { preferCache: true, prepareFullEditor: true, toastOnSuccess: false, warnNeedsBackfill: true });
        if (!prep.ok) {
            if (prep.error && typeof showNotification === 'function') showNotification(prep.error, 'error');
            return;
        }
        const slidesPayload = prep.slidesPayload;
        if (typeof window.canOpenEmbeddedFullEditor === 'function' && !window.canOpenEmbeddedFullEditor(slidesPayload)) {
            alert('\u77e2\u91cf\u5199\u5165\u540e\u4ecd\u65e0\u6cd5\u6253\u5f00\u5b8c\u6574\u7f16\u8f91\uff08\u6bcf\u9875\u9700\u5177\u5907 elements \u6570\u7ec4\uff09');
            return;
        }
        if (window.__embeddedPptistEditorInstance && typeof window.__embeddedPptistEditorInstance.destroy === 'function') {
            window.__embeddedPptistEditorInstance.destroy();
        }
        window.__embeddedPptistEditorInstance = null;
        iframe.src = 'about:blank';
        overlay.classList.add('is-visible');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('embedded-full-editor-open');
        const titleHint = (window.wisedeckEditorConfig && window.wisedeckEditorConfig.projectInfo && window.wisedeckEditorConfig.projectInfo.title) || '';
        let initialSlideIndex = typeof currentSlideIndex === 'number' && Number.isFinite(currentSlideIndex) ? Math.floor(currentSlideIndex) : 0;
        if (slidesPayload.length > 0) initialSlideIndex = Math.max(0, Math.min(initialSlideIndex, slidesPayload.length - 1));
        else initialSlideIndex = 0;
        window.__embeddedPptistEditorInstance = new EditorCls({
            embedded: true, projectId, initialSlides: slidesPayload, initialSlideIndex,
            mergedPptxBlobForDirectImport: prep.mergedPptxBlob || null, projectTitle: titleHint,
            domIds: { iframe: 'embeddedPptistIframe', closeBtn: 'embeddedFullEditorCloseBtn', saveBtn: 'embeddedFullEditorSaveBtn' },
            onSaved: (savedSlides) => {
                applyEmbeddedEditorSavedSlides(savedSlides);
                if (typeof showNotification === 'function') showNotification('\u5df2\u4fdd\u5b58\u5230\u5e7b\u706f\u7247\u7f16\u8f91\u5668', 'success');
                else alert('\u4fdd\u5b58\u6210\u529f');
                offerSyncMainPreviewAfterFullEditorSave(projectId);
                closeEmbeddedFullEditor({ restoreVisualSnapshot: false });
            },
            onCloseRequest: () => { showEmbeddedFullEditorCloseDialog(); },
            onClose: () => { closeEmbeddedFullEditor({ restoreVisualSnapshot: true }); },
        });
        iframe.src = `/static/pptist_dist/index.html?v=${Date.now()}`;
        if (typeof showNotification === 'function') showNotification('\u5b8c\u6574\u7f16\u8f91\u5df2\u6253\u5f00', 'success');
    } finally { pptxBridgeBusy = false; }
}

window.openFullEditor = openFullEditor;

function initFullEditorIntegration() {
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'fullEditorSaved') {
            const pid = event.data.projectId;
            if (pid) refreshSlidesData(pid);
        }
    });
}

async function refreshSlidesData(projectId, options) {
    const opts = options || {};
    let payload = null;
    try {
        const response = await fetch(`/api/projects/${projectId}/slides-data`, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            payload = data;
            if (data.slides_data && data.slides_data.length > 0) {
                window.projectSlidesData = data.slides_data;
                if (opts.applyToEditor !== false) {
                    applyEmbeddedEditorSavedSlides(data.slides_data);
                }
                if (opts.warnNeedsBackfill !== false && data.needs_elements_backfill && typeof showNotification === 'function') {
                    showNotification('\u4ecd\u6709\u5e7b\u706f\u7247\u7f3a\u5c11 elements\uff0c\u8bf7\u91cd\u8bd5\u540c\u6b65\u77e2\u91cf', 'warning');
                }
                if (!opts.suppressToast) {
                    const toast = document.createElement('div');
                    toast.className = 'editor-toast';
                    toast.textContent = opts.toastMessage || '\u5e7b\u706f\u7247\u5df2\u4ece\u5b8c\u6574\u7f16\u8f91\u5668\u66f4\u65b0';
                    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#28a745;color:#fff;padding:12px 24px;border-radius:8px;z-index:10000;';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);
                }
            }
        }
    } catch (error) { console.error('refreshSlidesData failed', error); }
    return opts.returnPayload ? payload : null;
}

function updateSlideThumbnails(slides) {
    const container = document.querySelector('.slides-container');
    if (!container) return;
    const currentIndex = window.currentSlideIndex || 0;
    container.innerHTML = '';
    slides.forEach((slide, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `slide-thumbnail ${index === currentIndex ? 'active' : ''}`;
        thumbnail.dataset.slideIndex = index;
        thumbnail.draggable = true;
        const previewHtml = window.slidePreviewHtml && typeof window.slidePreviewHtml === 'function' ? window.slidePreviewHtml(slide) : slide.html_content || '';
        thumbnail.innerHTML = `<div class="drag-indicator top"></div><div class="slide-preview"><iframe title="Slide ${index + 1}"></iframe></div><div class="slide-title">${index + 1}. ${slide.title || ''}</div><div class="drag-indicator bottom"></div>`;
        const thumbIframe = thumbnail.querySelector('iframe');
        if (thumbIframe && typeof window.setSafeIframeContent === 'function') window.setSafeIframeContent(thumbIframe, previewHtml, { force: true });
        thumbnail.addEventListener('click', () => { if (typeof selectSlide === 'function') selectSlide(index); });
        container.appendChild(thumbnail);
    });
}

function updateCurrentSlidePreview(slide) {
    const slideFrame = document.getElementById('slideFrame');
    if (slideFrame && slide && typeof window.setSafeIframeContent === 'function') {
        window.setSafeIframeContent(slideFrame, window.slidePreviewHtml ? window.slidePreviewHtml(slide) : slide.html_content || '', { force: true });
    }
}

window.closeEmbeddedFullEditor = closeEmbeddedFullEditor;
window.initFullEditorIntegration = initFullEditorIntegration;
window.syncVectorSlidesFromDomToPptx = syncVectorSlidesFromDomToPptx;
window.slidesLikelyNeedDomPptxVectorSync = slidesLikelyNeedDomPptxVectorSync;
window.refreshSlidesData = refreshSlidesData;
window.applyEmbeddedEditorSavedSlides = applyEmbeddedEditorSavedSlides;
window.syncMainPreviewFromFullEditorElements = syncMainPreviewFromFullEditorElements;
window.offerSyncMainPreviewAfterFullEditorSave = offerSyncMainPreviewAfterFullEditorSave;