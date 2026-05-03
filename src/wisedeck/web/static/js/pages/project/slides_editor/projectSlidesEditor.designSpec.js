/**
 * Design specification — GET/PUT/PATCH /api/projects/:id/design-spec，常用字段表单 + 锁定。
 */
(function () {
    if (typeof window === 'undefined') return;

    function _pid() {
        return window.projectId || (window.wisedeckEditorConfig && window.wisedeckEditorConfig.projectId);
    }

    function _syncFormFromSpec(spec) {
        const s = spec && typeof spec === 'object' ? spec : {};
        const tone = document.getElementById('wdDesignSpecTone');
        const density = document.getElementById('wdDesignSpecDensity');
        const lang = document.getElementById('wdDesignSpecLangStyle');
        if (tone) tone.value = s.tone != null ? String(s.tone) : '';
        if (density) density.value = s.density != null ? String(s.density) : '';
        if (lang) lang.value = s.language_style != null ? String(s.language_style) : '';
    }

    function _overlayFormOntoParsed(obj) {
        const out = obj && typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : {};
        const tone = document.getElementById('wdDesignSpecTone');
        const density = document.getElementById('wdDesignSpecDensity');
        const lang = document.getElementById('wdDesignSpecLangStyle');
        if (tone && tone.value.trim()) out.tone = tone.value.trim();
        if (density && density.value.trim()) out.density = density.value.trim();
        if (lang && lang.value.trim()) out.language_style = lang.value.trim();
        return out;
    }

    async function _patchDesignSpec(body) {
        const projectId = _pid();
        const res = await fetch('/api/projects/' + encodeURIComponent(projectId) + '/design-spec', {
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

    async function openDesignSpecModal() {
        const projectId = _pid();
        if (!projectId) return;
        const modalId = 'wdDesignSpecModal';
        let el = document.getElementById(modalId);
        if (!el) {
            el = document.createElement('div');
            el.id = modalId;
            el.className = 'modal fade';
            el.setAttribute('tabindex', '-1');
            el.innerHTML =
                '<div class="modal-dialog modal-lg modal-dialog-scrollable">' +
                '<div class="modal-content">' +
                '<div class="modal-header"><h5 class="modal-title">设计规格（design_spec）</h5>' +
                '<button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>' +
                '<div class="modal-body">' +
                '<p class="small text-muted">保存后版本号递增；与生成提示合并时会在服务端与所选全局母版的 <code>style_config</code> 合并（项目字段覆盖模板默认）。</p>' +
                '<div class="form-check mb-2">' +
                '<input class="form-check-input" type="checkbox" id="wdDesignSpecLockCb" />' +
                '<label class="form-check-label" for="wdDesignSpecLockCb">锁定规格（锁定后无法修改 JSON 或合并字段，需先取消锁定）</label></div>' +
                '<div class="row g-2 mb-2">' +
                '<div class="col-md-4"><label class="form-label small mb-0">语气 tone</label>' +
                '<input type="text" class="form-control form-control-sm" id="wdDesignSpecTone" placeholder="如：专业、亲和" /></div>' +
                '<div class="col-md-4"><label class="form-label small mb-0">密度 density</label>' +
                '<input type="text" class="form-control form-control-sm" id="wdDesignSpecDensity" placeholder="如：高信息密度" /></div>' +
                '<div class="col-md-4"><label class="form-label small mb-0">语言风格 language_style</label>' +
                '<input type="text" class="form-control form-control-sm" id="wdDesignSpecLangStyle" placeholder="如：简体书面语" /></div></div>' +
                '<label class="form-label small">完整 JSON（高级）</label>' +
                '<textarea id="wdDesignSpecTextarea" class="form-control font-monospace" rows="12" spellcheck="false"></textarea>' +
                '<div class="mt-2 small text-muted" id="wdDesignSpecVersion"></div>' +
                '</div>' +
                '<div class="modal-footer d-flex flex-wrap gap-2">' +
                '<button type="button" class="btn btn-outline-primary" id="wdDesignSpecSaveMergeBtn">合并常用字段</button>' +
                '<button type="button" class="btn btn-primary" id="wdDesignSpecSaveBtn">保存完整 JSON</button>' +
                '</div></div></div>';
            document.body.appendChild(el);

            document.getElementById('wdDesignSpecLockCb').addEventListener('change', async function () {
                const cb = document.getElementById('wdDesignSpecLockCb');
                try {
                    const data = await _patchDesignSpec({ design_spec_locked: !!cb.checked });
                    const ver = document.getElementById('wdDesignSpecVersion');
                    if (ver) {
                        ver.textContent =
                            '当前版本: v' +
                            (data.design_spec_version || '') +
                            (data.design_spec_locked ? ' · 已锁定' : '');
                    }
                    _applyLockedUi(!!data.design_spec_locked);
                } catch (e) {
                    alert(String(e.message || e));
                    cb.checked = !cb.checked;
                }
            });

            document.getElementById('wdDesignSpecSaveBtn').addEventListener('click', async function () {
                const raw = document.getElementById('wdDesignSpecTextarea').value.trim();
                let obj = {};
                if (raw) {
                    try {
                        obj = JSON.parse(raw);
                    } catch (e) {
                        alert('JSON 格式无效: ' + e.message);
                        return;
                    }
                }
                const projectIdInner = _pid();
                const res = await fetch('/api/projects/' + encodeURIComponent(projectIdInner) + '/design-spec', {
                    method: 'PUT',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ design_spec: obj }),
                });
                const data = await res.json().catch(function () {
                    return {};
                });
                if (!res.ok) {
                    alert(data.detail || '保存失败');
                    return;
                }
                const ver = document.getElementById('wdDesignSpecVersion');
                if (ver) ver.textContent = '当前版本: v' + (data.design_spec_version || '');
                if (window.bootstrap && window.bootstrap.Modal) {
                    window.bootstrap.Modal.getInstance(el).hide();
                }
            });

            document.getElementById('wdDesignSpecSaveMergeBtn').addEventListener('click', async function () {
                const raw = document.getElementById('wdDesignSpecTextarea').value.trim();
                let base = {};
                if (raw) {
                    try {
                        base = JSON.parse(raw);
                    } catch (e) {
                        alert('JSON 格式无效: ' + e.message);
                        return;
                    }
                }
                const merged = _overlayFormOntoParsed(base);
                try {
                    const data = await _patchDesignSpec({ design_spec: merged });
                    const ta = document.getElementById('wdDesignSpecTextarea');
                    if (ta) ta.value = JSON.stringify(data.design_spec || {}, null, 2);
                    _syncFormFromSpec(data.design_spec || {});
                    const ver = document.getElementById('wdDesignSpecVersion');
                    if (ver) {
                        ver.textContent =
                            '当前版本: v' +
                            (data.design_spec_version || '') +
                            (data.design_spec_locked ? ' · 已锁定' : '');
                    }
                    _applyLockedUi(!!data.design_spec_locked);
                } catch (e) {
                    alert(String(e.message || e));
                }
            });
        }

        try {
            const res = await fetch('/api/projects/' + encodeURIComponent(projectId) + '/design-spec', {
                credentials: 'same-origin',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || res.statusText);
            const ta = document.getElementById('wdDesignSpecTextarea');
            const ver = document.getElementById('wdDesignSpecVersion');
            const lockCb = document.getElementById('wdDesignSpecLockCb');
            if (ta) ta.value = JSON.stringify(data.design_spec || {}, null, 2);
            _syncFormFromSpec(data.design_spec || {});
            if (lockCb) lockCb.checked = !!data.design_spec_locked;
            if (ver) {
                ver.textContent =
                    '当前版本: v' +
                    (data.design_spec_version || 1) +
                    (data.design_spec_locked ? ' · 已锁定' : '');
            }
            _applyLockedUi(!!data.design_spec_locked);
        } catch (e) {
            alert(String(e.message || e));
            return;
        }
        if (window.bootstrap && window.bootstrap.Modal) {
            window.bootstrap.Modal.getOrCreateInstance(el).show();
        } else {
            el.style.display = 'block';
        }
    }

    function _applyLockedUi(locked) {
        const ta = document.getElementById('wdDesignSpecTextarea');
        const saveFull = document.getElementById('wdDesignSpecSaveBtn');
        const saveMerge = document.getElementById('wdDesignSpecSaveMergeBtn');
        const tone = document.getElementById('wdDesignSpecTone');
        const density = document.getElementById('wdDesignSpecDensity');
        const lang = document.getElementById('wdDesignSpecLangStyle');
        if (ta) ta.readOnly = !!locked;
        [tone, density, lang].forEach(function (inp) {
            if (inp) inp.disabled = !!locked;
        });
        if (saveFull) saveFull.disabled = !!locked;
        if (saveMerge) saveMerge.disabled = !!locked;
    }

    window.openDesignSpecModal = openDesignSpecModal;
})();
