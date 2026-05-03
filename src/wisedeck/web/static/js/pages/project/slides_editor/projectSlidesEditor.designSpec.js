/**
 * Design specification — GET/PUT/PATCH /api/projects/:id/design-spec，常用字段表单 + 锁定。
 * 语气 / 密度 / 语言风格 选项与需求确认页 design_spec_requirements_fields.html 保持一致。
 */
(function () {
    if (typeof window === 'undefined') return;

    function _pid() {
        return window.projectId || (window.wisedeckEditorConfig && window.wisedeckEditorConfig.projectId);
    }

    function _tonePresets() {
        return ['专业严谨', '亲和易懂', '销售说服', '学术客观', '简洁直接'];
    }
    function _densityPresets() {
        return ['稀疏要点', '平衡适中', '高信息密度'];
    }
    function _langPresets() {
        return ['简体书面', '简体口语', '英文简洁', '英文正式'];
    }

    function _tripletFieldHtml(label, selectId, customId, wrapId, presets, firstSelected) {
        var opts;
        if (firstSelected && presets.indexOf(firstSelected) >= 0) {
            opts = presets
                .map(function (v) {
                    return (
                        '<option value="' +
                        v.replace(/"/g, '&quot;') +
                        '"' +
                        (v === firstSelected ? ' selected' : '') +
                        '>' +
                        v +
                        '</option>'
                    );
                })
                .join('');
        } else {
            opts = presets
                .map(function (v, i) {
                    return (
                        '<option value="' +
                        v.replace(/"/g, '&quot;') +
                        '"' +
                        (i === 0 ? ' selected' : '') +
                        '>' +
                        v +
                        '</option>'
                    );
                })
                .join('');
        }
        return (
            '<div>' +
            '<label style="display:block;margin-bottom:8px;color:#2c3e50;font-weight:bold;" for="' +
            selectId +
            '">' +
            label +
            '</label>' +
            '<select id="' +
            selectId +
            '" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;background:#fff;">' +
            opts +
            '<option value="__custom__">自定义…</option></select>' +
            '<div id="' +
            wrapId +
            '" style="display:none;margin-top:8px;">' +
            '<input type="text" id="' +
            customId +
            '" placeholder="自定义" autocomplete="off" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;" />' +
            '</div></div>'
        );
    }

    function _applyTripletFromSaved(saved, selectId, customId, wrapId, presets, defaultPreset) {
        var sel = document.getElementById(selectId);
        var cust = document.getElementById(customId);
        var wrap = document.getElementById(wrapId);
        if (!sel) return;
        var str = saved != null ? String(saved).trim() : '';
        if (str && presets.indexOf(str) >= 0) {
            sel.value = str;
            if (wrap) wrap.style.display = 'none';
            if (cust) cust.value = '';
        } else if (str) {
            sel.value = '__custom__';
            if (cust) cust.value = str;
            if (wrap) wrap.style.display = 'block';
        } else {
            sel.value = defaultPreset;
            if (wrap) wrap.style.display = 'none';
            if (cust) cust.value = '';
        }
    }

    function _readTriplet(selectId, customId) {
        var sel = document.getElementById(selectId);
        var cust = document.getElementById(customId);
        if (!sel) return '';
        if (sel.value === '__custom__') {
            return cust && cust.value.trim() ? cust.value.trim() : '';
        }
        return sel.value.trim();
    }

    function _wireTriplet(selectId, customId, wrapId) {
        var sel = document.getElementById(selectId);
        var cust = document.getElementById(customId);
        var wrap = document.getElementById(wrapId);
        if (!sel) return;
        function sync() {
            if (sel.value === '__custom__') {
                if (wrap) wrap.style.display = 'block';
            } else {
                if (wrap) wrap.style.display = 'none';
            }
        }
        sel.addEventListener('change', sync);
        if (cust) cust.addEventListener('input', sync);
        sync();
    }

    function _syncFormFromSpec(spec) {
        var s = spec && typeof spec === 'object' ? spec : {};
        _applyTripletFromSaved(s.tone, 'wdDesignSpecToneSel', 'wdDesignSpecToneCustom', 'wdDesignSpecToneWrap', _tonePresets(), '专业严谨');
        _applyTripletFromSaved(
            s.density,
            'wdDesignSpecDensitySel',
            'wdDesignSpecDensityCustom',
            'wdDesignSpecDensityWrap',
            _densityPresets(),
            '平衡适中'
        );
        _applyTripletFromSaved(
            s.language_style,
            'wdDesignSpecLangSel',
            'wdDesignSpecLangCustom',
            'wdDesignSpecLangWrap',
            _langPresets(),
            '简体书面'
        );
    }

    function _overlayFormOntoParsed(obj) {
        var out = obj && typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : {};
        var t = _readTriplet('wdDesignSpecToneSel', 'wdDesignSpecToneCustom');
        var d = _readTriplet('wdDesignSpecDensitySel', 'wdDesignSpecDensityCustom');
        var l = _readTriplet('wdDesignSpecLangSel', 'wdDesignSpecLangCustom');
        if (t) out.tone = t;
        if (d) out.density = d;
        if (l) out.language_style = l;
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
                '<div class="mb-2" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;align-items:start;">' +
                _tripletFieldHtml('语气 tone', 'wdDesignSpecToneSel', 'wdDesignSpecToneCustom', 'wdDesignSpecToneWrap', _tonePresets(), '专业严谨') +
                _tripletFieldHtml(
                    '密度 density',
                    'wdDesignSpecDensitySel',
                    'wdDesignSpecDensityCustom',
                    'wdDesignSpecDensityWrap',
                    _densityPresets(),
                    '平衡适中'
                ) +
                _tripletFieldHtml(
                    '语言风格 language_style',
                    'wdDesignSpecLangSel',
                    'wdDesignSpecLangCustom',
                    'wdDesignSpecLangWrap',
                    _langPresets(),
                    '简体书面'
                ) +
                '</div>' +
                '<label class="form-label small">完整 JSON（高级）</label>' +
                '<textarea id="wdDesignSpecTextarea" class="form-control font-monospace" rows="12" spellcheck="false"></textarea>' +
                '<div class="mt-2 small text-muted" id="wdDesignSpecVersion"></div>' +
                '</div>' +
                '<div class="modal-footer d-flex flex-wrap gap-2">' +
                '<button type="button" class="btn btn-outline-primary" id="wdDesignSpecSaveMergeBtn">合并常用字段</button>' +
                '<button type="button" class="btn btn-primary" id="wdDesignSpecSaveBtn">保存完整 JSON</button>' +
                '</div></div></div>';
            document.body.appendChild(el);

            _wireTriplet('wdDesignSpecToneSel', 'wdDesignSpecToneCustom', 'wdDesignSpecToneWrap');
            _wireTriplet('wdDesignSpecDensitySel', 'wdDesignSpecDensityCustom', 'wdDesignSpecDensityWrap');
            _wireTriplet('wdDesignSpecLangSel', 'wdDesignSpecLangCustom', 'wdDesignSpecLangWrap');

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
        const ids = [
            'wdDesignSpecToneSel',
            'wdDesignSpecToneCustom',
            'wdDesignSpecDensitySel',
            'wdDesignSpecDensityCustom',
            'wdDesignSpecLangSel',
            'wdDesignSpecLangCustom',
        ];
        if (ta) ta.readOnly = !!locked;
        ids.forEach(function (id) {
            const n = document.getElementById(id);
            if (n) n.disabled = !!locked;
        });
        if (saveFull) saveFull.disabled = !!locked;
        if (saveMerge) saveMerge.disabled = !!locked;
    }

    window.openDesignSpecModal = openDesignSpecModal;
})();
