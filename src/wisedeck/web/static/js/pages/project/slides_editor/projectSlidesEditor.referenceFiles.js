/**
 * Project reference documents — upload / list / delete / reorder / context estimate.
 */
(function () {
    if (typeof window === 'undefined') return;

    function _pid() {
        return window.projectId || (window.wisedeckEditorConfig && window.wisedeckEditorConfig.projectId);
    }

    function _escapeHtml(s) {
        if (s == null || s === undefined) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    async function _patchJson(url, body) {
        const res = await fetch(url, {
            method: 'PATCH',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json().catch(function () {
            return {};
        });
        if (!res.ok) throw new Error(data.detail || res.statusText);
        return data;
    }

    function _parseModeFromUi() {
        const deepRd = document.getElementById('wdRefParseDeep');
        return deepRd && deepRd.checked ? 'deep' : 'light';
    }

    async function refreshReferenceList(container) {
        const projectId = _pid();
        if (!projectId) return;
        const res = await fetch('/api/projects/' + encodeURIComponent(projectId) + '/reference-files', {
            credentials: 'same-origin',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || res.statusText);
        const files = data.files || [];
        if (!container) return;
        if (files.length === 0) {
            container.innerHTML =
                '<p class="text-muted small mb-0">暂无参考文件。上传 PDF、Word 或文本用于大纲与幻灯片生成时的上下文。</p>';
            return;
        }
        container.innerHTML = files
            .map(function (f, idx) {
                const fid = f.file_id || '';
                const st = f.parse_status || '';
                const err = f.error_message ? ' · ' + _escapeHtml(String(f.error_message).slice(0, 120)) : '';
                const used = f.parse_mode_used ? ' · 解析:' + _escapeHtml(f.parse_mode_used) : '';
                const chars = typeof f.parsed_char_count === 'number' ? ' · 约' + f.parsed_char_count + '字' : '';
                const inc = f.include_in_prompt !== false;
                const fidAttr = _escapeHtml(fid);
                const fnEsc = _escapeHtml(f.original_filename || '');
                const stEsc = _escapeHtml(st);
                return (
                    '<div class="d-flex justify-content-between align-items-start border rounded p-2 mb-2 small wd-ref-row" data-file-id="' +
                    fidAttr +
                    '">' +
                    '<div class="flex-grow-1 me-2">' +
                    '<div class="d-flex align-items-center gap-1 mb-1">' +
                    '<button type="button" class="btn btn-sm btn-outline-secondary py-0 px-1" data-rf-up="' +
                    fidAttr +
                    '"' +
                    (idx === 0 ? ' disabled' : '') +
                    '>↑</button>' +
                    '<button type="button" class="btn btn-sm btn-outline-secondary py-0 px-1" data-rf-down="' +
                    fidAttr +
                    '"' +
                    (idx === files.length - 1 ? ' disabled' : '') +
                    '>↓</button>' +
                    '</div>' +
                    '<div><strong>' +
                    fnEsc +
                    '</strong><br><span class="text-muted">' +
                    stEsc +
                    used +
                    chars +
                    err +
                    '</span></div>' +
                    '<div class="form-check form-check-inline mt-1">' +
                    '<input class="form-check-input" type="checkbox" data-rf-inc="' +
                    fidAttr +
                    '" id="rf-inc-' +
                    fidAttr +
                    '"' +
                    (inc ? ' checked' : '') +
                    ' />' +
                    '<label class="form-check-label" for="rf-inc-' +
                    fidAttr +
                    '">参与生成</label></div></div>' +
                    '<div class="d-flex flex-column gap-1">' +
                    '<button type="button" class="btn btn-sm btn-outline-secondary" data-rf-reindex="' +
                    fidAttr +
                    '">重新解析</button>' +
                    '<button type="button" class="btn btn-sm btn-outline-danger" data-rf-del="' +
                    fidAttr +
                    '">删除</button></div></div>'
                );
            })
            .join('');

        const reorder = async function (newOrder) {
            await fetch('/api/projects/' + encodeURIComponent(projectId) + '/reference-files/reorder', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file_ids: newOrder }),
            }).then(function (r) {
                return r.json().then(function (d) {
                    if (!r.ok) throw new Error(d.detail || r.statusText);
                });
            });
            await refreshReferenceList(container);
        };

        container.querySelectorAll('[data-rf-up]').forEach(function (btn) {
            btn.onclick = async function () {
                const fid = btn.getAttribute('data-rf-up');
                const order = files.map(function (x) {
                    return x.file_id;
                });
                const i = order.indexOf(fid);
                if (i <= 0) return;
                const t = order[i - 1];
                order[i - 1] = order[i];
                order[i] = t;
                await reorder(order);
            };
        });
        container.querySelectorAll('[data-rf-down]').forEach(function (btn) {
            btn.onclick = async function () {
                const fid = btn.getAttribute('data-rf-down');
                const order = files.map(function (x) {
                    return x.file_id;
                });
                const i = order.indexOf(fid);
                if (i < 0 || i >= order.length - 1) return;
                const t = order[i + 1];
                order[i + 1] = order[i];
                order[i] = t;
                await reorder(order);
            };
        });

        container.querySelectorAll('[data-rf-inc]').forEach(function (cb) {
            cb.onchange = async function () {
                const fid = cb.getAttribute('data-rf-inc');
                try {
                    await _patchJson(
                        '/api/projects/' + encodeURIComponent(projectId) + '/reference-files/' + encodeURIComponent(fid),
                        { include_in_prompt: !!cb.checked }
                    );
                } catch (e) {
                    alert(String(e.message || e));
                    cb.checked = !cb.checked;
                }
            };
        });

        container.querySelectorAll('[data-rf-del]').forEach(function (btn) {
            btn.onclick = async function () {
                const fid = btn.getAttribute('data-rf-del');
                if (!fid || !confirm('删除此参考文件？')) return;
                const r = await fetch(
                    '/api/projects/' + encodeURIComponent(projectId) + '/reference-files/' + encodeURIComponent(fid),
                    { method: 'DELETE', credentials: 'same-origin' }
                );
                if (!r.ok) {
                    const err = await r.json().catch(function () {
                        return {};
                    });
                    alert(err.detail || '删除失败');
                    return;
                }
                await refreshReferenceList(container);
            };
        });

        container.querySelectorAll('[data-rf-reindex]').forEach(function (btn) {
            btn.onclick = async function () {
                const fid = btn.getAttribute('data-rf-reindex');
                if (!fid) return;
                const modeNow = _parseModeFromUi();
                btn.disabled = true;
                try {
                    const r = await fetch(
                        '/api/projects/' +
                            encodeURIComponent(projectId) +
                            '/reference-files/' +
                            encodeURIComponent(fid) +
                            '/reindex?parse_mode=' +
                            encodeURIComponent(modeNow),
                        { method: 'POST', credentials: 'same-origin' }
                    );
                    const d = await r.json().catch(function () {
                        return {};
                    });
                    if (!r.ok) throw new Error(d.detail || r.statusText);
                    await refreshReferenceList(container);
                } catch (e) {
                    alert(String(e.message || e));
                } finally {
                    btn.disabled = false;
                }
            };
        });
    }

    async function refreshContextEstimate() {
        const projectId = _pid();
        if (!projectId) return;
        const hintEl = document.getElementById('wdRefEstimateHint');
        const outEl = document.getElementById('wdRefEstimateOut');
        if (!outEl) return;
        const q = hintEl && hintEl.value ? hintEl.value.trim() : '';
        outEl.textContent = '计算中…';
        try {
            const url =
                '/api/projects/' +
                encodeURIComponent(projectId) +
                '/prompt-context-estimate' +
                (q ? '?query_hint=' + encodeURIComponent(q) : '');
            const res = await fetch(url, { credentials: 'same-origin' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || res.statusText);
            outEl.textContent =
                '约 ' +
                (data.approx_chars || 0) +
                ' 字符，预估 ' +
                (data.approx_tokens_est || 0) +
                ' tokens（按当前参考与设计规格合并后注入提示的粗算）。';
        } catch (e) {
            outEl.textContent = '估算失败: ' + String(e.message || e);
        }
    }

    async function syncRefContextToggle(cb) {
        const projectId = _pid();
        if (!projectId || !cb) return;
        try {
            await _patchJson('/api/projects/' + encodeURIComponent(projectId) + '/context-settings', {
                reference_context_enabled: !!cb.checked,
            });
        } catch (e) {
            alert(String(e.message || e));
            cb.checked = !cb.checked;
        }
    }

    async function openReferenceFilesModal() {
        const projectId = _pid();
        if (!projectId) {
            console.warn('projectId missing');
            return;
        }
        const modalId = 'wdReferenceFilesModal';
        let el = document.getElementById(modalId);
        if (!el) {
            el = document.createElement('div');
            el.id = modalId;
            el.className = 'modal fade';
            el.setAttribute('tabindex', '-1');
            el.innerHTML =
                '<div class="modal-dialog modal-lg modal-dialog-scrollable">' +
                '<div class="modal-content">' +
                '<div class="modal-header"><h5 class="modal-title">参考文档</h5>' +
                '<button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>' +
                '<div class="modal-body">' +
                '<p class="small text-muted">解析成功的内容会进入大纲与逐页生成的提示（与联网研究无关）。单文件最大 25MB。深度解析使用 MarkItDown，失败时回退轻量抽取。</p>' +
                '<div class="form-check mb-2">' +
                '<input class="form-check-input" type="checkbox" id="wdRefContextEnabled" checked />' +
                '<label class="form-check-label" for="wdRefContextEnabled">启用参考文档上下文注入</label></div>' +
                '<div class="mb-2 small"><span class="text-muted">新上传解析模式：</span>' +
                '<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="wdRefParseMode" id="wdRefParseLight" value="light" checked />' +
                '<label class="form-check-label" for="wdRefParseLight">轻量</label></div>' +
                '<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="wdRefParseMode" id="wdRefParseDeep" value="deep" />' +
                '<label class="form-check-label" for="wdRefParseDeep">深度</label></div>' +
                '<span class="text-muted">（重新解析按钮使用此处选项）</span></div>' +
                '<div class="mb-2"><label class="form-label small mb-0">注入量估算（可选主题/要点关键词）</label>' +
                '<div class="input-group input-group-sm">' +
                '<input type="text" class="form-control" id="wdRefEstimateHint" placeholder="例如当前页标题或大纲要点" />' +
                '<button type="button" class="btn btn-outline-secondary" id="wdRefEstimateBtn">估算</button></div>' +
                '<div class="small text-muted mt-1" id="wdRefEstimateOut"></div></div>' +
                '<div class="mb-3"><input type="file" id="wdReferenceFileInput" class="form-control form-control-sm" /></div>' +
                '<div id="wdReferenceFilesList"></div>' +
                '</div></div></div>';
            document.body.appendChild(el);
            document.getElementById('wdRefContextEnabled').addEventListener('change', function () {
                syncRefContextToggle(document.getElementById('wdRefContextEnabled'));
            });
            document.getElementById('wdRefEstimateBtn').addEventListener('click', refreshContextEstimate);
            document.getElementById('wdReferenceFileInput').addEventListener('change', async function (ev) {
                const input = ev.target;
                const file = input.files && input.files[0];
                if (!file) return;
                const fd = new FormData();
                fd.append('file', file);
                const deep = document.getElementById('wdRefParseDeep') && document.getElementById('wdRefParseDeep').checked;
                fd.append('parse_mode', deep ? 'deep' : 'light');
                try {
                    const res = await fetch('/api/projects/' + encodeURIComponent(projectId) + '/reference-files', {
                        method: 'POST',
                        body: fd,
                        credentials: 'same-origin',
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.detail || res.statusText);
                    input.value = '';
                    await refreshReferenceList(document.getElementById('wdReferenceFilesList'));
                } catch (e) {
                    alert(String(e.message || e));
                }
            });
        }
        try {
            const cs = await fetch('/api/projects/' + encodeURIComponent(projectId) + '/context-settings', {
                credentials: 'same-origin',
            }).then(function (r) {
                return r.json();
            });
            const cbx = document.getElementById('wdRefContextEnabled');
            if (cbx && typeof cs.reference_context_enabled === 'boolean') {
                cbx.checked = cs.reference_context_enabled;
            }
        } catch (ignore) {
            /* ignore */
        }
        const listEl = document.getElementById('wdReferenceFilesList');
        listEl.innerHTML = '<p class="text-muted small">加载中…</p>';
        try {
            await refreshReferenceList(listEl);
            await refreshContextEstimate();
        } catch (e) {
            listEl.innerHTML =
                '<p class="text-danger small">加载失败: ' + _escapeHtml(String(e.message || e)) + '</p>';
        }
        if (window.bootstrap && window.bootstrap.Modal) {
            window.bootstrap.Modal.getOrCreateInstance(el).show();
        } else {
            el.style.display = 'block';
        }
    }

    window.openReferenceFilesModal = openReferenceFilesModal;
})();
