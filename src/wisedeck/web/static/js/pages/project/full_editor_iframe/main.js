/**
 * PPTist IFrame 编辑器
 * 用于 WiseDeck 完整编辑功能
 * 使用 localStorage 进行数据传递
 *
 * Standalone：不传参数，`new PPTistIFrameEditor()`
 * 嵌入式：`new PPTistIFrameEditor({ embedded: true, projectId, initialSlides, initialSlideIndex, domIds, onSaved, onClose })`
 */

const PPTIST_STORAGE_KEY = 'wisedeck_pptist_slides';

/** P1 diagnostics: ?wisedeck_diag=1 on parent URL or localStorage WISEDECK_FULL_EDITOR_DIAG=1 */
function wisedeckFullEditorDiagEnabled() {
    try {
        if (typeof window !== 'undefined' && window.location && String(window.location.search || '').includes('wisedeck_diag=1')) {
            return true;
        }
        if (typeof localStorage !== 'undefined' && localStorage.getItem('WISEDECK_FULL_EDITOR_DIAG') === '1') {
            return true;
        }
    } catch (_) {
        /* ignore */
    }
    return false;
}

/**
 * Logs serialized postMessage payload size and coarse element stats (parent console).
 * @param {Record<string, unknown>} message SYNC_SLIDES_TO_PPTIST payload
 * @param {string} label
 */
function logSlidesPostMessageDiag(message, label) {
    if (!wisedeckFullEditorDiagEnabled()) return;
    try {
        const s = JSON.stringify(message);
        const utf8Bytes = new TextEncoder().encode(s).length;
        const slides = Array.isArray(message.slides) ? message.slides : [];
        let elemsTotal = 0;
        let textNonempty = 0;
        let imageSrcNonempty = 0;
        let imageSrcEmpty = 0;
        for (const sl of slides) {
            const els = sl && typeof sl === 'object' && Array.isArray(sl.elements) ? sl.elements : [];
            elemsTotal += els.length;
            for (const el of els) {
                if (!el || typeof el !== 'object') continue;
                if (el.type === 'text' && typeof el.content === 'string') {
                    const c = el.content.trim();
                    if (c && c !== '<p></p>' && c !== '<p><br></p>') textNonempty += 1;
                } else if (el.type === 'image') {
                    const src = typeof el.src === 'string' ? el.src.trim() : '';
                    if (src) imageSrcNonempty += 1;
                    else imageSrcEmpty += 1;
                }
            }
        }
        console.info('[WiseDeck full-editor diag]', label, {
            slideCount: slides.length,
            jsonStringifyChars: s.length,
            approxUtf8Bytes: utf8Bytes,
            elementsTotal: elemsTotal,
            textElementsNonempty: textNonempty,
            imageElementsSrcNonempty: imageSrcNonempty,
            imageElementsSrcEmpty: imageSrcEmpty,
            mergedPptxBytesDiag: 'localStorage WISEDECK_PPTX_BRIDGE_DIAG=1（导出 / seed 前打印 merged Blob SHA-256）',
        });
    } catch (e) {
        console.warn('[WiseDeck full-editor diag] stringify failed', label, e);
    }
}

class PPTistIFrameEditor {
    /**
     * @param {object} [opts]
     * @param {boolean} [opts.embedded]
     * @param {string} [opts.projectId]
     * @param {object[]} [opts.initialSlides]
     * @param {number} [opts.initialSlideIndex] 打开后与主编辑器当前选中页对齐（相对 slidesData）
     * @param {Blob} [opts.mergedPptxBlobForDirectImport] 合并 PPTX：优先 iframe 内浏览器解析 + 服务端规范化注入（失败再 JSON SYNC）
     * @param {string} [opts.projectTitle]
     * @param {object} [opts.domIds] iframe / closeBtn / saveBtn
     * @param {(slides: object[]) => void} [opts.onSaved]
     * @param {() => void} [opts.onClose]
     */
    constructor(opts = {}) {
        console.log('[PPTistIFrameEditor] Initializing...');

        this.opts = opts;
        this.embedded = !!opts.embedded;
        this.onSaved = typeof opts.onSaved === 'function' ? opts.onSaved : null;
        this.onClose = typeof opts.onClose === 'function' ? opts.onClose : null;
        /** @param {() => void} [opts.onCloseRequest] 嵌入式「返回」：由宿主展示确认框 */
        this.onCloseRequest = typeof opts.onCloseRequest === 'function' ? opts.onCloseRequest : null;

        this.domIds = {
            iframe: (opts.domIds && opts.domIds.iframe) || 'pptist-iframe',
            closeBtn: (opts.domIds && opts.domIds.closeBtn) || 'closeModalBtn',
            saveBtn: (opts.domIds && opts.domIds.saveBtn) || 'saveAndReturnBtn',
        };

        this._abort = new AbortController();

        this.projectId = null;
        this.slidesData = [];
        this.projectTitle = '';
        this.iframeReady = false;
        /** @type {'modal'|'minimal'} */
        this.chrome = 'modal';

        /** 防止 load 与 flush 并发各跑一遍iframe同步 */
        this._pptistIframeSyncRunning = false;
        /** @type {'idle'|'importing'|'ok'|'failed'} */
        this._directImportState = 'idle';
        /** @type {Promise<void>|null} */
        this._pptistEmbedReadyPromise = null;
        this._pptistEmbedReadyResolve = null;
        /** @type {((result: { ok: boolean, slides?: object[], error?: string }) => void)|null} */
        this._pendingSaveResolve = null;
        this._saveInFlight = false;

        this.init();
    }

    /** 移除监听并清理（嵌入式关闭浮层时调用） */
    destroy() {
        try {
            this._abort.abort();
        } catch (_) {
            // ignore
        }
        this.clearLocalStorage();
    }

    _iframeEl() {
        return document.getElementById(this.domIds.iframe);
    }

    /** @param {string} [src] */
    _isWiseDeckPptistIframeSrc(src) {
        const s = src || '';
        return s.includes('/static/pptist_dist/index.html');
    }

    /**
     * True when PPTist embed sets __WISEDECK_PPTX_IMPORT_BRIDGE__ (in-app importPPTXFile).
     * @param {HTMLIFrameElement} iframe
     */
    _isPptxImportBridgeReady(iframe) {
        try {
            const cw = iframe && iframe.contentWindow;
            return !!(cw && cw.__WISEDECK_PPTX_IMPORT_BRIDGE__ === true);
        } catch (_) {
            return false;
        }
    }

    /**
     * iframe 已指向 PPTist 且同源可读 document 时，若 load 早于监听注册则补跑同步。
     * @param {HTMLIFrameElement} iframe
     * @param {AbortSignal} sig
     */
    _flushIframeSyncIfAlreadyLoaded(iframe, sig) {
        requestAnimationFrame(() => {
            queueMicrotask(() => {
                if (sig.aborted) return;
                if (!this._isWiseDeckPptistIframeSrc(iframe.src)) return;
                let rs = '';
                try {
                    rs = iframe.contentDocument?.readyState || '';
                } catch (_) {
                    return;
                }
                if (rs !== 'complete' && rs !== 'interactive') return;
                if (wisedeckFullEditorDiagEnabled()) {
                    console.info('[WiseDeck full-editor diag]', 'flushIframeSyncIfAlreadyLoaded', {
                        readyState: rs,
                        src: iframe.src,
                    });
                }
                void this._executePptistIframeSync(iframe);
            });
        });
    }

    _resetPptistEmbedReadyWait() {
        this._pptistEmbedReadyPromise = new Promise((resolve) => {
            this._pptistEmbedReadyResolve = resolve;
        });
    }

    _notifyPptistEmbedReady() {
        if (this._pptistEmbedReadyResolve) {
            this._pptistEmbedReadyResolve();
            this._pptistEmbedReadyResolve = null;
        }
    }

    /**
     * 等待 PPTist onMounted 发出 PPTIST_EMBED_READY，避免早于 Vue message 监听发导入。
     * @param {number} [timeoutMs]
     */
    _waitForPptistEmbedReady(timeoutMs = 45000) {
        if (!this._pptistEmbedReadyPromise) {
            this._resetPptistEmbedReadyWait();
        }
        const ready = this._pptistEmbedReadyPromise;
        const timeout = new Promise((_, reject) => {
            window.setTimeout(() => reject(new Error('embed ready timeout')), timeoutMs);
        });
        return Promise.race([ready, timeout]);
    }

    /**
     * 单次直连 PPTX 导入（importPPTXFile），成功则禁止后续 JSON 覆写。
     * @param {HTMLIFrameElement} iframe
     * @returns {Promise<boolean>}
     */
    async _runDirectPptxImport(iframe) {
        const cw = iframe.contentWindow;
        const blob = this.opts.mergedPptxBlobForDirectImport;
        if (!cw || !(blob instanceof Blob) || blob.size <= 0 || !this.projectId) {
            return false;
        }

        const importTargetOrigin = '*';
        const DIRECT_POSTMESSAGE_MAX_BYTES = 24 * 1024 * 1024;
        const DIRECT_WAIT_MS = 120000;
        const slideIdx = this._effectiveSlideIndex();

        this._directImportState = 'importing';

        let settled = false;
        const directDone = new Promise((resolve) => {
            const onParentMsg = (ev) => {
                const d = ev.data;
                if (!d || typeof d !== 'object' || d.projectId !== this.projectId) return;
                if (d.type === 'WISEDECK_IMPORT_PPTX_DONE') {
                    settled = true;
                    window.removeEventListener('message', onParentMsg);
                    resolve({ ok: true });
                } else if (d.type === 'WISEDECK_IMPORT_PPTX_ERROR') {
                    settled = true;
                    window.removeEventListener('message', onParentMsg);
                    resolve({ ok: false, error: d.error || 'unknown' });
                }
            };
            window.addEventListener('message', onParentMsg);
            window.setTimeout(() => {
                if (settled) return;
                window.removeEventListener('message', onParentMsg);
                resolve({ ok: false, error: 'timeout' });
            }, DIRECT_WAIT_MS);
        });

        const postOnce = async () => {
            if (blob.size <= DIRECT_POSTMESSAGE_MAX_BYTES) {
                const ab = await blob.arrayBuffer();
                cw.postMessage(
                    {
                        type: 'WISEDECK_IMPORT_PPTX_FROM_PARENT',
                        projectId: this.projectId,
                        slideIndex: slideIdx,
                        arrayBuffer: ab.slice(0),
                    },
                    importTargetOrigin
                );
                return;
            }
            const fd = new FormData();
            fd.append('file', blob, 'merged.pptx');
            const st = await fetch(
                `/api/projects/${encodeURIComponent(this.projectId)}/full-editor/pptx-import-staging`,
                { method: 'POST', credentials: 'include', body: fd }
            );
            if (!st.ok) {
                throw new Error(`staging HTTP ${st.status}`);
            }
            const j = await st.json();
            if (!j.success || !j.token) {
                throw new Error('staging response invalid');
            }
            const tokenEnc = encodeURIComponent(j.token);
            const fetchUrl = `/api/projects/${encodeURIComponent(this.projectId)}/full-editor/pptx-import-staging/${tokenEnc}`;
            cw.postMessage(
                {
                    type: 'WISEDECK_IMPORT_PPTX_FROM_PARENT',
                    projectId: this.projectId,
                    slideIndex: slideIdx,
                    fetchUrl,
                },
                importTargetOrigin
            );
        };

        try {
            try {
                await this._waitForPptistEmbedReady();
            } catch (e) {
                console.warn('[PPTistIFrameEditor] PPTIST_EMBED_READY timeout', e);
                this._directImportState = 'failed';
                return false;
            }

            await postOnce();
            let outcome = await directDone;

            if (!outcome.ok && outcome.error === 'timeout') {
                console.info('[PPTistIFrameEditor] Retrying direct PPTX import once after timeout');
                settled = false;
                const retryDone = new Promise((resolve) => {
                    const onParentMsg = (ev) => {
                        const d = ev.data;
                        if (!d || typeof d !== 'object' || d.projectId !== this.projectId) return;
                        if (d.type === 'WISEDECK_IMPORT_PPTX_DONE') {
                            settled = true;
                            window.removeEventListener('message', onParentMsg);
                            resolve({ ok: true });
                        } else if (d.type === 'WISEDECK_IMPORT_PPTX_ERROR') {
                            settled = true;
                            window.removeEventListener('message', onParentMsg);
                            resolve({ ok: false, error: d.error || 'unknown' });
                        }
                    };
                    window.addEventListener('message', onParentMsg);
                    window.setTimeout(() => {
                        if (settled) return;
                        window.removeEventListener('message', onParentMsg);
                        resolve({ ok: false, error: 'timeout' });
                    }, DIRECT_WAIT_MS);
                });
                await new Promise((r) => window.setTimeout(r, 800));
                await postOnce();
                outcome = await retryDone;
            }

            if (outcome.ok) {
                this._directImportState = 'ok';
                console.log('[PPTistIFrameEditor] Direct PPTX import completed (canvas from importPPTXFile)');
                return true;
            }

            this._directImportState = 'failed';
            console.warn('[PPTistIFrameEditor] Direct PPTX import failed:', outcome.error);
            if (this.embedded && typeof showNotification === 'function') {
                showNotification(
                    '完整编辑未能从 PPTX 加载幻灯片，请关闭后重试或在 PPTist 内手动导入同一文件',
                    'error'
                );
            } else {
                alert('完整编辑 PPTX 导入失败：' + (outcome.error || 'unknown'));
            }
            return false;
        } catch (e) {
            this._directImportState = 'failed';
            console.warn('[PPTistIFrameEditor] Direct PPTX import exception', e);
            return false;
        }
    }

    /**
     * PPTist iframe 一轮：直连 importPPTXFile（嵌入）或 JSON 同步（非嵌入/无 blob）。
     * @param {HTMLIFrameElement} iframe
     */
    async _executePptistIframeSync(iframe) {
        if (!iframe.contentWindow) return;
        if (!this._isWiseDeckPptistIframeSrc(iframe.src)) return;
        if (this._pptistIframeSyncRunning) return;
        if (this._directImportState === 'ok') {
            console.log('[PPTistIFrameEditor] Skipping sync; direct PPTX import already ok');
            return;
        }
        this._pptistIframeSyncRunning = true;

        try {
            console.log('[PPTistIFrameEditor] IFrame loaded');
            this.iframeReady = true;

            const blob = this.opts.mergedPptxBlobForDirectImport;
            const bridgeReady = this._isPptxImportBridgeReady(iframe);
            const tryDirect =
                bridgeReady &&
                this.embedded &&
                blob instanceof Blob &&
                blob.size > 0 &&
                this.projectId;

            if (!bridgeReady && this.embedded && blob instanceof Blob && blob.size > 0) {
                console.info(
                    '[PPTistIFrameEditor] PPTX import bridge not ready; embedded without direct import'
                );
            }

            if (tryDirect) {
                const ok = await this._runDirectPptxImport(iframe);
                if (ok) {
                    return;
                }
                if (this.embedded) {
                    console.warn(
                        '[PPTistIFrameEditor] Embedded mode: not applying JSON SYNC after failed direct import (avoids overwriting partial import)'
                    );
                    return;
                }
            }

            if (this._directImportState === 'importing') {
                return;
            }

            if (this.slidesData && this.slidesData.length > 0) {
                console.log('[PPTistIFrameEditor] Sending slides via postMessage:', this.slidesData.length);
                logSlidesPostMessageDiag(
                    {
                        type: 'SYNC_SLIDES_TO_PPTIST',
                        slides: this.slidesData,
                        projectId: this.projectId,
                        slideIndex: this._effectiveSlideIndex(),
                    },
                    'embedded-or-template-sync'
                );
                this._postSyncSlidesToIframe(iframe);
            } else {
                console.warn('[PPTistIFrameEditor] No slides data from template, trying API...');
                const fetched = await this.fetchSlidesFromAPI();
                if (fetched && this.slidesData && this.slidesData.length > 0) {
                    console.log(
                        '[PPTistIFrameEditor] Sending fetched slides via postMessage:',
                        this.slidesData.length
                    );
                    this._postSyncSlidesToIframe(iframe);
                } else {
                    console.error('[PPTistIFrameEditor] No slides data available');
                }
            }
        } finally {
            this._pptistIframeSyncRunning = false;
        }
    }

    /** @returns {number} 相对当前 this.slidesData 裁剪后的页索引 */
    _effectiveSlideIndex() {
        const n = this.slidesData.length;
        if (n <= 0) {
            return 0;
        }
        const raw =
            typeof this.opts.initialSlideIndex === 'number' && Number.isFinite(this.opts.initialSlideIndex)
                ? Math.floor(this.opts.initialSlideIndex)
                : 0;
        return Math.max(0, Math.min(raw, n - 1));
    }

    init() {
        console.log('[PPTistIFrameEditor] Loading project data...');

        this._directImportState = 'idle';
        this._resetPptistEmbedReadyWait();
        this.loadProjectData();
        this.bindEvents();

        console.log('[PPTistIFrameEditor] Initialization complete');
    }

    loadProjectData() {
        try {
            if (this.embedded) {
                this.projectId = this.opts.projectId || null;
                this.slidesData = Array.isArray(this.opts.initialSlides)
                    ? this.opts.initialSlides.slice()
                    : [];
                this.projectTitle = this.opts.projectTitle || '';
                console.log('[PPTistIFrameEditor] Embedded load:', this.projectId, this.slidesData.length, 'slides');
                return;
            }

            const projectDataScript = document.getElementById('projectDataScript');
            const slidesScript = document.getElementById('projectSlidesScript');
            const metaScript = document.getElementById('projectMetaScript');

            if (projectDataScript) {
                const projectData = JSON.parse(projectDataScript.textContent);
                this.projectId = projectData.projectId;
                console.log('[PPTistIFrameEditor] Project ID:', this.projectId);
            }

            if (slidesScript) {
                const slidesData = JSON.parse(slidesScript.textContent);
                this.slidesData = slidesData.slides || [];
                console.log('[PPTistIFrameEditor] Loaded slides:', this.slidesData.length);
            }

            if (metaScript) {
                const meta = JSON.parse(metaScript.textContent);
                this.projectTitle = meta.title || '';
                console.log('[PPTistIFrameEditor] Project title:', this.projectTitle);
            }

            const chromeScript = document.getElementById('wdsFullEditorChrome');
            if (chromeScript) {
                try {
                    const j = JSON.parse(chromeScript.textContent);
                    if (j.chrome === 'minimal' || j.chrome === 'modal') {
                        this.chrome = j.chrome;
                    }
                } catch (_) {
                    // ignore
                }
            }
            const qp = new URLSearchParams(window.location.search || '').get('chrome');
            if (qp === 'minimal' || qp === 'modal') {
                this.chrome = qp;
            }

            if (!this.projectId) {
                const path = window.location.pathname;
                const match = path.match(/\/projects\/([^\/]+)\/full-editor/);
                if (match) {
                    this.projectId = match[1];
                    console.log('[PPTistIFrameEditor] Project ID from URL:', this.projectId);
                }
            }
        } catch (e) {
            console.error('[PPTistIFrameEditor] Failed to load project data:', e);
        }
    }

    storeDataToLocalStorage() {
        if (this.slidesData.length === 0) {
            console.warn('[PPTistIFrameEditor] No slides data to store');
            return;
        }

        const storageData = {
            projectId: this.projectId,
            slides: this.slidesData,
            slideIndex: this._effectiveSlideIndex(),
            timestamp: Date.now(),
        };

        localStorage.setItem(PPTIST_STORAGE_KEY, JSON.stringify(storageData));
        console.log('[PPTistIFrameEditor] Data stored to localStorage:', this.slidesData.length, 'slides');
    }

    async fetchSlidesFromAPI() {
        if (!this.projectId) {
            console.error('[PPTistIFrameEditor] No projectId for API fetch');
            return false;
        }

        try {
            console.log('[PPTistIFrameEditor] Fetching slides from API:', this.projectId);
            const response = await fetch(`/api/projects/${this.projectId}/slides-data`, {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                if (data.slides_data && data.slides_data.length > 0) {
                    this.slidesData = data.slides_data;
                    console.log('[PPTistIFrameEditor] Fetched slides from API:', this.slidesData.length);
                    return true;
                }
                console.warn('[PPTistIFrameEditor] API returned empty slides');
            } else {
                console.error('[PPTistIFrameEditor] API request failed:', response.status);
            }
        } catch (e) {
            console.error('[PPTistIFrameEditor] Failed to fetch slides from API:', e);
        }
        return false;
    }

    /**
     * 优先同源 origin，短延时再以 `*` 兜底，避免部分环境下严格 targetOrigin 静默丢消息。
     * @param {HTMLIFrameElement} iframe
     * @param {Record<string, unknown>} payload
     */
    _deliverSyncPayloadToIframe(iframe, payload) {
        if (this._directImportState === 'ok' || this._directImportState === 'importing') {
            if (wisedeckFullEditorDiagEnabled()) {
                console.info('[PPTistIFrameEditor] Blocked SYNC deliver; direct import state:', this._directImportState);
            }
            return;
        }
        const cw = iframe.contentWindow;
        if (!cw) return;
        const strictOrigin = window.location.origin;
        if (strictOrigin) {
            try {
                cw.postMessage(payload, strictOrigin);
            } catch (_) {
                /* ignore */
            }
        }
        window.setTimeout(() => {
            try {
                cw.postMessage(payload, '*');
            } catch (_) {
                /* ignore */
            }
        }, 70);
    }

    /**
     * JSON 同步：多轮延时投递，缓解 PPTist message 监听注册竞态。
     * @param {HTMLIFrameElement} iframe
     * @param {number[]} [delaysMs]
     */
    _postSyncSlidesToIframe(iframe, delaysMs) {
        if (!iframe.contentWindow) return;
        if (this._directImportState === 'ok' || this._directImportState === 'importing') {
            return;
        }
        if (this.embedded && this.opts.mergedPptxBlobForDirectImport instanceof Blob && this.opts.mergedPptxBlobForDirectImport.size > 0) {
            console.warn('[PPTistIFrameEditor] Skipping JSON sync in embedded PPTX mode');
            return;
        }
        const syncPayload = {
            type: 'SYNC_SLIDES_TO_PPTIST',
            slides: this.slidesData,
            projectId: this.projectId,
            slideIndex: this._effectiveSlideIndex(),
            meta: {
                themeColors:
                    (window.wisedeckEditorConfig && window.wisedeckEditorConfig.themeColors) || [],
            },
        };
        logSlidesPostMessageDiag(syncPayload, 'fallback-json-sync');
        const delays = Array.isArray(delaysMs) && delaysMs.length > 0 ? delaysMs : [0, 400, 1200, 2800, 4500];
        delays.forEach((ms) => {
            window.setTimeout(() => {
                this._deliverSyncPayloadToIframe(iframe, syncPayload);
            }, ms);
        });
    }

    clearLocalStorage() {
        localStorage.removeItem(PPTIST_STORAGE_KEY);
    }

    bindEvents() {
        console.log('[PPTistIFrameEditor] Binding events...');

        const sig = this._abort.signal;

        const closeBtn = document.getElementById(this.domIds.closeBtn);
        if (closeBtn) {
            closeBtn.addEventListener(
                'click',
                () => {
                    if (this.embedded && this.onCloseRequest) {
                        this.onCloseRequest();
                        return;
                    }
                    this.closeModal();
                },
                { signal: sig }
            );
        }

        const shellCloseBtn = document.getElementById('shellCloseBtn');
        if (shellCloseBtn) {
            shellCloseBtn.addEventListener(
                'click',
                () => {
                    this.clearLocalStorage();
                    if (this.embedded && this.onClose) {
                        this.onClose();
                        return;
                    }
                    if (this.projectId) {
                        window.location.href = '/projects/' + this.projectId + '/edit';
                    } else {
                        window.history.back();
                    }
                },
                { signal: sig }
            );
        }

        const saveBtn =
            document.getElementById(this.domIds.saveBtn) || document.getElementById('shellSaveBtn');
        if (saveBtn) {
            saveBtn.addEventListener(
                'click',
                () => {
                    void this.saveAndReturn();
                },
                { signal: sig }
            );
        }

        const iframe = this._iframeEl();
        if (iframe) {
            iframe.addEventListener(
                'load',
                () => {
                    void this._executePptistIframeSync(iframe);
                },
                { signal: sig }
            );

            this._flushIframeSyncIfAlreadyLoaded(iframe, sig);

            iframe.addEventListener(
                'error',
                () => {
                    console.error('[PPTistIFrameEditor] IFrame failed to load');
                },
                { signal: sig }
            );
        }

        window.addEventListener(
            'message',
            (event) => {
                console.log('[PPTistIFrameEditor] Received message:', event.data);

                if (event.data && event.data.type === 'PPTIST_EMBED_READY') {
                    const ifr = this._iframeEl();
                    if (ifr && event.source === ifr.contentWindow) {
                        this._notifyPptistEmbedReady();
                    }
                    return;
                }

                if (event.data && event.data.type === 'WISEDECK_RELAY_SYNC_SLIDES_TO_PPTIST') {
                    const ifr = this._iframeEl();
                    if (!ifr || !ifr.contentWindow || event.source !== ifr.contentWindow) {
                        return;
                    }
                    if (window.location.origin && event.origin !== window.location.origin) {
                        return;
                    }
                    const d = event.data;
                    if (d.projectId !== this.projectId || !Array.isArray(d.slides)) {
                        return;
                    }
                    let slideIndex =
                        typeof d.slideIndex === 'number' && Number.isFinite(d.slideIndex)
                            ? Math.floor(d.slideIndex)
                            : this._effectiveSlideIndex();
                    const slides = d.slides;
                    const n = slides.length;
                    if (n > 0) {
                        slideIndex = Math.max(0, Math.min(slideIndex, n - 1));
                    } else {
                        slideIndex = 0;
                    }
                    const syncPayload = {
                        type: 'SYNC_SLIDES_TO_PPTIST',
                        slides,
                        projectId: this.projectId,
                        slideIndex,
                        meta: d.meta && typeof d.meta === 'object' ? d.meta : undefined,
                    };
                    if (wisedeckFullEditorDiagEnabled()) {
                        console.info('[WiseDeck full-editor diag]', 'WISEDECK_RELAY_SYNC_SLIDES_TO_PPTIST', {
                            slideCount: n,
                            slideIndex,
                        });
                    }
                    logSlidesPostMessageDiag(syncPayload, 'relay-from-bridge');
                    this._deliverSyncPayloadToIframe(ifr, syncPayload);
                    return;
                }

                if (event.data && event.data.type === 'SAVE_SLIDES_FROM_PPTIST') {
                    void this._onSaveSlidesFromPptist(event.data);
                }

                if (event.data && event.data.type === 'PPTIST_REQUEST_DATA') {
                    console.log('[PPTistIFrameEditor] PPTist requesting data');
                    this.storeDataToLocalStorage();
                    const ifr = this._iframeEl();
                    if (ifr && ifr.contentWindow) {
                        ifr.contentWindow.postMessage(
                            {
                                type: 'PPTIST_DATA_READY',
                                key: PPTIST_STORAGE_KEY,
                            },
                            '*'
                        );
                    }
                }
            },
            { signal: sig }
        );

        if (!this.embedded) {
            window.addEventListener(
                'beforeunload',
                () => {
                    console.log('[PPTistIFrameEditor] Page unloading');
                    this.clearLocalStorage();
                },
                { signal: sig }
            );
        }
    }

    _setSaveUiBusy(busy) {
        const saveBtn =
            document.getElementById(this.domIds.saveBtn) || document.getElementById('shellSaveBtn');
        const closeBtn = document.getElementById(this.domIds.closeBtn);
        for (const el of [saveBtn, closeBtn]) {
            if (!el) continue;
            el.disabled = !!busy;
            if (busy) {
                el.setAttribute('aria-busy', 'true');
            } else {
                el.removeAttribute('aria-busy');
            }
        }
        if (saveBtn) {
            saveBtn.dataset.wisedeckSaveBusy = busy ? '1' : '';
        }
    }

    /**
     * @param {object[]} rawSlides from PPTist iframe
     * @returns {Promise<object[]>}
     */
    async _fetchSlidesDataAfterSave(rawSlides) {
        try {
            const response = await fetch('/api/projects/' + encodeURIComponent(this.projectId) + '/slides-data', {
                credentials: 'include',
            });
            if (response.ok) {
                const body = await response.json();
                if (body.slides_data && Array.isArray(body.slides_data) && body.slides_data.length > 0) {
                    return body.slides_data;
                }
            }
        } catch (e) {
            console.warn('[PPTistIFrameEditor] slides-data refresh failed, using PUT payload', e);
        }
        return rawSlides;
    }

    /**
     * @param {object} data SAVE_SLIDES_FROM_PPTIST payload
     * @param {{ syncVisualFromElements?: boolean }} [options]
     * @returns {Promise<{ ok: boolean, slides?: object[], error?: string }>}
     */
    async handleSaveFromPPTist(data, options) {
        console.log('[PPTistIFrameEditor] Handling save from PPTist...');
        const opts = options || {};

        if (!data.slides || !Array.isArray(data.slides)) {
            console.error('[PPTistIFrameEditor] Invalid slides data from PPTist');
            return { ok: false, error: 'invalid slides' };
        }

        try {
            const response = await fetch('/api/projects/' + encodeURIComponent(this.projectId) + '/slides', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    slides: data.slides,
                    slides_data: data.slides,
                    sync_visual_from_elements: !!opts.syncVisualFromElements,
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('[PPTistIFrameEditor] Save failed:', error);
                return { ok: false, error: error || 'save failed' };
            }

            console.log('[PPTistIFrameEditor] Slides saved successfully');
            this.clearLocalStorage();

            let slidesForUi = data.slides;
            try {
                const body = await response.json();
                if (body.slides_data && Array.isArray(body.slides_data) && body.slides_data.length > 0) {
                    slidesForUi = body.slides_data;
                } else {
                    slidesForUi = await this._fetchSlidesDataAfterSave(data.slides);
                }
            } catch (_) {
                slidesForUi = await this._fetchSlidesDataAfterSave(data.slides);
            }

            return { ok: true, slides: slidesForUi };
        } catch (e) {
            console.error('[PPTistIFrameEditor] Save error:', e);
            return { ok: false, error: 'network' };
        }
    }

    async _onSaveSlidesFromPptist(data) {
        const result = await this.handleSaveFromPPTist(data);
        if (this._pendingSaveResolve) {
            const resolve = this._pendingSaveResolve;
            this._pendingSaveResolve = null;
            resolve(result);
            return;
        }
        if (!result.ok) {
            alert('保存失败：' + (result.error || '未知错误'));
            return;
        }
        if (this.onSaved) {
            try {
                this.onSaved(result.slides);
            } catch (cbErr) {
                console.error('[PPTistIFrameEditor] onSaved error:', cbErr);
            }
        } else {
            alert('保存成功');
            try {
                if (window.opener && typeof window.opener.location?.reload === 'function') {
                    window.opener.location.reload();
                }
            } catch (_) {}
            window.close();
        }
    }

    async saveAndReturn() {
        if (this._saveInFlight) {
            return false;
        }

        console.log('[PPTistIFrameEditor] Requesting save from PPTist...');

        const iframe = this._iframeEl();
        if (!iframe || !iframe.contentWindow) {
            console.error('[PPTistIFrameEditor] IFrame not ready');
            alert('编辑器未加载完成，请稍候');
            return false;
        }

        this._saveInFlight = true;
        this._setSaveUiBusy(true);

        const saveWaitMs = 90000;
        const savePromise = new Promise((resolve) => {
            this._pendingSaveResolve = resolve;
            window.setTimeout(() => {
                if (!this._pendingSaveResolve) return;
                this._pendingSaveResolve = null;
                resolve({ ok: false, error: 'timeout' });
            }, saveWaitMs);
        });

        iframe.contentWindow.postMessage(
            {
                type: 'REQUEST_SAVE_FROM_PPTIST',
                projectId: this.projectId,
            },
            '*'
        );

        let result = { ok: false, error: 'unknown' };
        try {
            result = await savePromise;
        } finally {
            this._saveInFlight = false;
            this._setSaveUiBusy(false);
        }

        if (!result.ok) {
            alert('保存失败：' + (result.error === 'timeout' ? '等待编辑器响应超时' : result.error || '未知错误'));
            return false;
        }

        if (this.onSaved) {
            try {
                this.onSaved(result.slides);
            } catch (cbErr) {
                console.error('[PPTistIFrameEditor] onSaved error:', cbErr);
            }
        }
        return true;
    }

    closeModal() {
        console.log('[PPTistIFrameEditor] Closing modal...');
        this.clearLocalStorage();

        if (this.embedded && this.onClose) {
            this.onClose();
            return;
        }

        if (this.projectId) {
            window.location.href = '/projects/' + this.projectId + '/edit';
        } else {
            window.history.back();
        }
    }
}

window.PPTistIFrameEditor = PPTistIFrameEditor;

console.log('[PPTistIFrameEditor] Script loaded');
