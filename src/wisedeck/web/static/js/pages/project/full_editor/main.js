console.log('[FullEditor] Script loaded, version 4.1');

class FullEditor {
    constructor() {
        console.log('[FullEditor] Constructor called');

        this.projectId = null;
        this.slidesData = [];
        this.currentSlideIndex = 0;
        this.selectedElement = null;
        this.selectedElementId = null;
        this.currentTool = 'select';
        this.currentShapeType = 'rect';
        this.zoom = 100;
        this.clipboard = null;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
        this.iframeReady = false;
        this.pendingMessages = [];

        this.slideManager = new SlideManager(this);
        this.historyManager = new HistoryManager(this);

        this.init();
    }

    init() {
        console.log('[FullEditor] Initializing...');

        if (window.slidesData && Array.isArray(window.slidesData)) {
            this.slidesData = window.slidesData;
            console.log('[FullEditor] Loaded from window.slidesData:', this.slidesData.length, 'slides');
        } else {
            console.warn('[FullEditor] No slidesData in window');
            this.slidesData = [];
        }

        if (window.projectData && window.projectData.projectId) {
            this.projectId = window.projectData.projectId;
            console.log('[FullEditor] Project ID from window:', this.projectId);
        } else if (!this.projectId) {
            const path = window.location.pathname;
            const match = path.match(/\/project\/([^\/]+)\/full-editor/);
            if (match) {
                this.projectId = match[1];
                console.log('[FullEditor] Project ID from URL:', this.projectId);
            }
        }

        this.bindEvents();

        console.log('[FullEditor] Total slides:', this.slidesData.length);

        if (this.slidesData.length > 0) {
            this.slideManager.renderThumbnails();
            this.slideManager.updateSlide();
            this.slideManager.updateSlideIndicator();
        } else {
            console.warn('[FullEditor] No slides data available');
        }

        console.log('[FullEditor] Initialization complete');
    }

    bindEvents() {
        console.log('[FullEditor] Binding events...');

        document.getElementById('backBtn')?.addEventListener('click', () => {
            window.close();
        });

        document.getElementById('prevSlideBtn')?.addEventListener('click', () => {
            this.slideManager.navigateSlide(-1);
        });

        document.getElementById('nextSlideBtn')?.addEventListener('click', () => {
            this.slideManager.navigateSlide(1);
        });

        document.getElementById('saveBtn')?.addEventListener('click', () => {
            this.save();
        });

        document.getElementById('exportBtn')?.addEventListener('click', () => {
            this.export();
        });

        document.getElementById('previewBtn')?.addEventListener('click', () => {
            this.screening();
        });

        document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
            this.changeZoom(-10);
        });

        document.getElementById('zoomInBtn')?.addEventListener('click', () => {
            this.changeZoom(10);
        });

        document.getElementById('zoomFitBtn')?.addEventListener('click', () => {
            this.fitToScreen();
        });

        document.getElementById('undoBtn')?.addEventListener('click', () => {
            this.historyManager.undo();
        });

        document.getElementById('redoBtn')?.addEventListener('click', () => {
            this.historyManager.redo();
        });

        document.getElementById('addSlideBtn')?.addEventListener('click', () => {
            this.slideManager.addSlide();
        });

        this.bindToolbarButtons();

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.save();
            }
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.historyManager.undo();
            }
            if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.historyManager.redo();
            }
        });

        window.addEventListener('message', (e) => {
            console.log('[FullEditor] Received message:', e.data);
            if (e.data && e.data.type === 'elementSelected') {
                this.handleElementSelected(e.data.data);
            }
        });

        console.log('[FullEditor] Events bound');
    }

    handleElementSelected(elementData) {
        console.log('[FullEditor] Element selected:', elementData);
        
        document.getElementById('propX').value = Math.round(elementData.x);
        document.getElementById('propY').value = Math.round(elementData.y);
        document.getElementById('propWidth').value = Math.round(elementData.width);
        document.getElementById('propHeight').value = Math.round(elementData.height);

        if (elementData.style) {
            document.getElementById('propFill').value = elementData.style.backgroundColor || '#ffffff';
            document.getElementById('propBorderColor').value = elementData.style.borderColor || '#333333';
            document.getElementById('propBorderWidth').value = elementData.style.borderWidth || '1';
            document.getElementById('propFontSize').value = parseInt(elementData.style.fontSize) || 24;
            document.getElementById('propFontColor').value = elementData.style.color || '#333333';
        }
    }

    bindToolbarButtons() {
        const toolbarBtns = document.querySelectorAll('.toolbar-btn');
        console.log('[FullEditor] Binding toolbar buttons, found:', toolbarBtns.length);

        toolbarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                const action = btn.dataset.action;
                console.log('[FullEditor] Button clicked - tool:', tool, 'action:', action);

                if (tool === 'text') {
                    this.addTextElement();
                } else if (tool === 'shape') {
                    this.addShapeElement();
                } else if (tool === 'chart') {
                    this.addChartElement();
                } else if (tool === 'table') {
                    this.addTableElement();
                } else if (tool === 'image') {
                    this.addImageElement();
                }

                if (action === 'delete') {
                    this.deleteSelectedElement();
                } else if (action === 'duplicate') {
                    this.copyAndPaste();
                } else if (action === 'bringFront') {
                    this.bringToFront();
                } else if (action === 'sendBack') {
                    this.sendToBack();
                }

                if (tool === 'shape') {
                    this.toggleShapePanel();
                } else {
                    document.getElementById('shapePanel')?.classList.remove('active');
                }
            });
        });

        document.getElementById('closeShapePanel')?.addEventListener('click', () => {
            document.getElementById('shapePanel')?.classList.remove('active');
        });

        const shapeItems = document.querySelectorAll('.shape-item');
        shapeItems.forEach(item => {
            item.addEventListener('click', () => {
                this.currentShapeType = item.dataset.shape;
                item.classList.add('selected');
            });
        });
    }

    toggleShapePanel() {
        const panel = document.getElementById('shapePanel');
        if (panel) {
            panel.classList.toggle('active');
        }
    }

    addTextElement() {
        console.log('[FullEditor] Adding text element');
        const slideFrame = document.getElementById('slideFrame');
        if (!slideFrame || !slideFrame.contentDocument) return;

        const doc = slideFrame.contentDocument;
        const text = doc.createElement('div');
        text.textContent = '双击编辑文本';
        text.style.cssText = 'position:absolute;left:100px;top:100px;width:300px;min-height:50px;font-size:24px;font-family:Microsoft YaHei;color:#333;padding:10px;border:1px dashed #ccc;cursor:move;';
        doc.body.appendChild(text);
    }

    addShapeElement() {
        console.log('[FullEditor] Adding shape element, type:', this.currentShapeType);
        const slideFrame = document.getElementById('slideFrame');
        if (!slideFrame || !slideFrame.contentDocument) return;

        const doc = slideFrame.contentDocument;
        const shape = doc.createElement('div');
        let style = 'position:absolute;left:100px;top:100px;width:150px;height:100px;background:#4472C4;border:2px solid #2F528F;cursor:move;';

        if (this.currentShapeType === 'circle') {
            style += 'border-radius:50%;';
        } else if (this.currentShapeType === 'roundedRect') {
            style += 'border-radius:10px;';
        }

        shape.style.cssText = style;
        doc.body.appendChild(shape);
    }

    addChartElement() {
        console.log('[FullEditor] Adding chart element');
        const slideFrame = document.getElementById('slideFrame');
        if (!slideFrame || !slideFrame.contentDocument) return;

        const doc = slideFrame.contentDocument;
        const chart = doc.createElement('div');
        chart.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#999;">图表占位符</div>';
        chart.style.cssText = 'position:absolute;left:100px;top:100px;width:400px;height:300px;background:#fff;border:1px solid #ddd;cursor:move;';
        doc.body.appendChild(chart);
    }

    addTableElement() {
        console.log('[FullEditor] Adding table element');
        const slideFrame = document.getElementById('slideFrame');
        if (!slideFrame || !slideFrame.contentDocument) return;

        const doc = slideFrame.contentDocument;
        const table = doc.createElement('table');
        table.style.cssText = 'width:100%;height:100%;border-collapse:collapse;';

        for (let i = 0; i < 3; i++) {
            const row = table.insertRow();
            for (let j = 0; j < 4; j++) {
                const cell = row.insertCell();
                cell.textContent = i === 0 ? '标题' + (j + 1) : '内容';
                cell.style.cssText = 'border:1px solid #ddd;padding:8px;text-align:center;background:' + (i === 0 ? '#f5f5f5' : '#fff') + ';';
            }
        }

        const wrapper = doc.createElement('div');
        wrapper.style.cssText = 'position:absolute;left:100px;top:100px;width:400px;height:150px;cursor:move;';
        wrapper.appendChild(table);
        doc.body.appendChild(wrapper);
    }

    addImageElement() {
        console.log('[FullEditor] Adding image element');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const slideFrame = document.getElementById('slideFrame');
                    if (!slideFrame || !slideFrame.contentDocument) return;

                    const doc = slideFrame.contentDocument;
                    const img = doc.createElement('img');
                    img.src = event.target.result;
                    img.style.cssText = 'position:absolute;left:100px;top:100px;width:200px;height:150px;cursor:move;object-fit:contain;';
                    doc.body.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    deleteSelectedElement() {
        console.log('[FullEditor] Delete selected element');
    }

    copyAndPaste() {
        console.log('[FullEditor] Copy and paste');
    }

    bringToFront() {
        console.log('[FullEditor] Bring to front');
    }

    sendToBack() {
        console.log('[FullEditor] Send to back');
    }

    changeZoom(delta) {
        this.zoom = Math.max(25, Math.min(200, this.zoom + delta));
        document.getElementById('zoomDisplay').textContent = this.zoom + '%';

        const slideFrameWrapper = document.getElementById('slideFrameWrapper');
        if (slideFrameWrapper) {
            slideFrameWrapper.style.transform = 'scale(' + (this.zoom / 100) + ')';
        }
    }

    fitToScreen() {
        this.zoom = 100;
        document.getElementById('zoomDisplay').textContent = '100%';

        const slideFrameWrapper = document.getElementById('slideFrameWrapper');
        if (slideFrameWrapper) {
            slideFrameWrapper.style.transform = 'scale(1)';
        }
    }

    async save() {
        console.log('[FullEditor] Saving...');
        if (!this.projectId) {
            alert('无法保存：缺少项目ID');
            return;
        }

        try {
            const response = await fetch('/api/projects/' + this.projectId + '/slides', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides_data: this.slidesData })
            });

            if (response.ok) {
                alert('保存成功');
            } else {
                alert('保存失败');
            }
        } catch (e) {
            console.error('Save failed:', e);
            alert('保存失败');
        }
    }

    export() {
        console.log('[FullEditor] Exporting...');
        if (this.projectId) {
            window.open('/api/projects/' + this.projectId + '/export/pptx', '_blank');
        }
    }

    screening() {
        console.log('[FullEditor] Screening...');
        if (this.projectId) {
            window.open('/api/projects/' + this.projectId + '/screening', '_blank');
        }
    }
}

class SlideManager {
    constructor(editor) {
        this.editor = editor;
    }

    navigateSlide(direction) {
        const newIndex = this.editor.currentSlideIndex + direction;
        if (newIndex >= 0 && newIndex < this.editor.slidesData.length) {
            this.editor.currentSlideIndex = newIndex;
            this.updateSlide();
            this.renderThumbnails();
            this.updateSlideIndicator();
        }
    }

    updateSlide() {
        const slideFrame = document.getElementById('slideFrame');
        if (!slideFrame) {
            console.error('[SlideManager] slideFrame not found');
            return;
        }

        const slide = this.editor.slidesData[this.editor.currentSlideIndex];
        console.log('[SlideManager] Updating slide', this.editor.currentSlideIndex, 'has content:', !!(slide && slide.html_content));

        let htmlContent = '';
        if (slide && slide.html_content) {
            htmlContent = slide.html_content;
        } else {
            htmlContent = '<!DOCTYPE html><html><head><style>body{margin:0;padding:0;width:1280px;height:720px;background:white;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;color:#999;}</style></head><body><p style="font-size:24px;">第' + (this.editor.currentSlideIndex + 1) + '页</p></body></html>';
        }

        slideFrame.srcdoc = htmlContent;
        slideFrame.onload = () => {
            this.injectEditorScript();
        };
    }

    injectEditorScript() {
        const slideFrame = document.getElementById('slideFrame');
        if (!slideFrame || !slideFrame.contentDocument) return;

        const doc = slideFrame.contentDocument;
        const script = doc.createElement('script');
        script.textContent = `
            (function() {
                const parentWindow = window.parent;
                let selectedElement = null;
                let selectionBox = null;
                let handles = [];
                let dragStartX = 0;
                let dragStartY = 0;
                let elementStartX = 0;
                let elementStartY = 0;
                let elementStartWidth = 0;
                let elementStartHeight = 0;
                let isDragging = false;
                let dragType = '';
                let clickStartTime = 0;

                function createSelectionBox(element) {
                    if (selectionBox) {
                        selectionBox.remove();
                    }
                    
                    handles.forEach(h => h.remove());
                    handles = [];

                    const rect = element.getBoundingClientRect();
                    
                    selectionBox = document.createElement('div');
                    selectionBox.className = 'selection-box';
                    selectionBox.style.left = rect.left + 'px';
                    selectionBox.style.top = rect.top + 'px';
                    selectionBox.style.width = rect.width + 'px';
                    selectionBox.style.height = rect.height + 'px';
                    document.body.appendChild(selectionBox);

                    const positions = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
                    positions.forEach(pos => {
                        const handle = document.createElement('div');
                        handle.className = 'resize-handle ' + pos;
                        document.body.appendChild(handle);
                        handles.push(handle);
                        
                        handle.addEventListener('mousedown', function(e) {
                            e.stopPropagation();
                            startResize(pos);
                        });
                    });
                    
                    updateHandles();
                }

                function updateHandles() {
                    if (!selectionBox) return;
                    
                    const rect = selectionBox.getBoundingClientRect();
                    const handleSize = 10;
                    
                    handles.forEach((handle, i) => {
                        const pos = handle.classList[1];
                        switch(pos) {
                            case 'nw': handle.style.left = rect.left - handleSize/2 + 'px'; handle.style.top = rect.top - handleSize/2 + 'px'; break;
                            case 'n': handle.style.left = rect.left + rect.width/2 - handleSize/2 + 'px'; handle.style.top = rect.top - handleSize/2 + 'px'; break;
                            case 'ne': handle.style.left = rect.left + rect.width - handleSize/2 + 'px'; handle.style.top = rect.top - handleSize/2 + 'px'; break;
                            case 'w': handle.style.left = rect.left - handleSize/2 + 'px'; handle.style.top = rect.top + rect.height/2 - handleSize/2 + 'px'; break;
                            case 'e': handle.style.left = rect.left + rect.width - handleSize/2 + 'px'; handle.style.top = rect.top + rect.height/2 - handleSize/2 + 'px'; break;
                            case 'sw': handle.style.left = rect.left - handleSize/2 + 'px'; handle.style.top = rect.top + rect.height - handleSize/2 + 'px'; break;
                            case 's': handle.style.left = rect.left + rect.width/2 - handleSize/2 + 'px'; handle.style.top = rect.top + rect.height - handleSize/2 + 'px'; break;
                            case 'se': handle.style.left = rect.left + rect.width - handleSize/2 + 'px'; handle.style.top = rect.top + rect.height - handleSize/2 + 'px'; break;
                        }
                    });
                }

                function removeSelectionBox() {
                    if (selectionBox) {
                        selectionBox.remove();
                        selectionBox = null;
                    }
                    handles.forEach(h => h.remove());
                    handles = [];
                }

                function selectElement(element) {
                    if (selectedElement) {
                        selectedElement.style.outline = '';
                    }
                    
                    selectedElement = element;
                    element.style.outline = '2px solid #4472C4';
                    element.style.outlineOffset = '2px';
                    
                    createSelectionBox(element);
                    
                    const rect = element.getBoundingClientRect();
                    parentWindow.postMessage({
                        type: 'elementSelected',
                        data: {
                            width: rect.width,
                            height: rect.height,
                            x: rect.left,
                            y: rect.top,
                            tagName: element.tagName,
                            content: element.textContent,
                            style: window.getComputedStyle(element)
                        }
                    }, '*');
                }

                function startResize(direction) {
                    if (!selectedElement) return;
                    
                    isDragging = true;
                    dragType = 'resize';
                    dragStartX = event.clientX;
                    dragStartY = event.clientY;
                    
                    const rect = selectedElement.getBoundingClientRect();
                    elementStartX = rect.left;
                    elementStartY = rect.top;
                    elementStartWidth = rect.width;
                    elementStartHeight = rect.height;
                    
                    document.addEventListener('mousemove', onDrag);
                    document.addEventListener('mouseup', stopDrag);
                }

                function startDrag(e) {
                    if (!selectedElement) return;
                    
                    isDragging = true;
                    dragType = 'move';
                    dragStartX = e.clientX;
                    dragStartY = e.clientY;
                    
                    const rect = selectedElement.getBoundingClientRect();
                    elementStartX = rect.left;
                    elementStartY = rect.top;
                    
                    document.addEventListener('mousemove', onDrag);
                    document.addEventListener('mouseup', stopDrag);
                }

                function onDrag(e) {
                    if (!isDragging || !selectedElement) return;
                    
                    const deltaX = e.clientX - dragStartX;
                    const deltaY = e.clientY - dragStartY;
                    
                    if (dragType === 'move') {
                        selectedElement.style.left = (elementStartX + deltaX) + 'px';
                        selectedElement.style.top = (elementStartY + deltaY) + 'px';
                        
                        if (selectionBox) {
                            selectionBox.style.left = (elementStartX + deltaX) + 'px';
                            selectionBox.style.top = (elementStartY + deltaY) + 'px';
                        }
                    } else if (dragType === 'resize') {
                        let newWidth = elementStartWidth;
                        let newHeight = elementStartHeight;
                        let newLeft = elementStartX;
                        let newTop = elementStartY;
                        
                        if (dragType.indexOf('e') !== -1) newWidth += deltaX;
                        if (dragType.indexOf('w') !== -1) { newWidth -= deltaX; newLeft += deltaX; }
                        if (dragType.indexOf('s') !== -1) newHeight += deltaY;
                        if (dragType.indexOf('n') !== -1) { newHeight -= deltaY; newTop += deltaY; }
                        
                        newWidth = Math.max(20, newWidth);
                        newHeight = Math.max(20, newHeight);
                        
                        selectedElement.style.left = newLeft + 'px';
                        selectedElement.style.top = newTop + 'px';
                        selectedElement.style.width = newWidth + 'px';
                        selectedElement.style.height = newHeight + 'px';
                        
                        if (selectionBox) {
                            selectionBox.style.left = newLeft + 'px';
                            selectionBox.style.top = newTop + 'px';
                            selectionBox.style.width = newWidth + 'px';
                            selectionBox.style.height = newHeight + 'px';
                        }
                    }
                    
                    updateHandles();
                }

                function stopDrag() {
                    isDragging = false;
                    dragType = '';
                    document.removeEventListener('mousemove', onDrag);
                    document.removeEventListener('mouseup', stopDrag);
                }

                document.addEventListener('click', function(e) {
                    if (e.target === document.body || e.target.tagName === 'HTML') {
                        removeSelectionBox();
                        if (selectedElement) {
                            selectedElement.style.outline = '';
                            selectedElement = null;
                        }
                        return;
                    }

                    const clickDuration = Date.now() - clickStartTime;
                    if (clickDuration < 200) {
                        selectElement(e.target);
                    }
                });

                document.addEventListener('mousedown', function(e) {
                    clickStartTime = Date.now();
                    
                    if (e.target === document.body || e.target.tagName === 'HTML') {
                        return;
                    }

                    if (e.target.classList.contains('resize-handle')) {
                        return;
                    }

                    if (!selectedElement || selectedElement !== e.target) {
                        selectElement(e.target);
                    }

                    if (selectedElement) {
                        const style = window.getComputedStyle(selectedElement);
                        if (style.position !== 'absolute' && style.position !== 'relative') {
                            selectedElement.style.position = 'absolute';
                            selectedElement.style.left = selectedElement.offsetLeft + 'px';
                            selectedElement.style.top = selectedElement.offsetTop + 'px';
                        }
                        
                        e.preventDefault();
                        startDrag(e);
                    }
                });
            })();
        `;
        doc.head.appendChild(script);
        console.log('[SlideManager] Editor script injected');
    }

    renderThumbnails() {
        const container = document.getElementById('thumbnailContainer');
        if (!container) {
            console.error('[SlideManager] thumbnailContainer not found');
            return;
        }

        console.log('[SlideManager] Rendering thumbnails for', this.editor.slidesData.length, 'slides');

        container.innerHTML = '';

        this.editor.slidesData.forEach((slide, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'slide-thumbnail' + (index === this.editor.currentSlideIndex ? ' active' : '');
            thumbnail.dataset.index = index;

            const htmlContent = slide && slide.html_content ? slide.html_content.replace(/"/g, '&quot;') : '<html><head><style>body{margin:0;padding:0;width:1280px;height:720px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#999;font-size:18px;font-family:Arial;}</style></head><body>第' + (index + 1) + '页</body></html>';

            thumbnail.innerHTML = '<div class="thumbnail-content"><iframe srcdoc="' + htmlContent + '" class="thumbnail-frame"></iframe></div><span class="thumbnail-index">' + (index + 1) + '</span>';

            thumbnail.addEventListener('click', () => {
                console.log('[SlideManager] Clicked thumbnail', index);
                this.editor.currentSlideIndex = index;
                this.updateSlide();
                this.renderThumbnails();
                this.updateSlideIndicator();
            });

            container.appendChild(thumbnail);
        });

        console.log('[SlideManager] Rendered', this.editor.slidesData.length, 'thumbnails');
    }

    updateSlideIndicator() {
        const indicator = document.getElementById('slideIndicator');
        if (indicator) {
            indicator.textContent = (this.editor.currentSlideIndex + 1) + ' / ' + this.editor.slidesData.length;
        }
    }

    addSlide() {
        const newSlide = {
            id: 'slide_' + Date.now(),
            html_content: '<!DOCTYPE html><html><head><style>body{margin:0;padding:0;width:1280px;height:720px;background:white;}</style></head><body></body></html>'
        };

        this.editor.slidesData.splice(this.editor.currentSlideIndex + 1, 0, newSlide);
        this.editor.currentSlideIndex++;
        this.updateSlide();
        this.renderThumbnails();
        this.updateSlideIndicator();
    }
}

class HistoryManager {
    constructor(editor) {
        this.editor = editor;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
    }

    saveSnapshot() {
        const slideFrame = document.getElementById('slideFrame');
        if (!slideFrame || !slideFrame.contentDocument) return;

        const html = slideFrame.contentDocument.documentElement.outerHTML;

        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }

        this.history.push({ html: html, slideIndex: this.editor.currentSlideIndex });

        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        this.historyIndex = this.history.length - 1;
    }

    undo() {
        console.log('[HistoryManager] Undo');
        if (this.historyIndex < 0) return;

        this.historyIndex--;
        this.restoreSnapshot(this.history[this.historyIndex]);
    }

    redo() {
        console.log('[HistoryManager] Redo');
        if (this.historyIndex >= this.history.length - 1) return;

        this.historyIndex++;
        this.restoreSnapshot(this.history[this.historyIndex]);
    }

    restoreSnapshot(snapshot) {
        const slideFrame = document.getElementById('slideFrame');
        if (!slideFrame) return;

        slideFrame.srcdoc = snapshot.html;
        this.editor.currentSlideIndex = snapshot.slideIndex;
    }
}

console.log('[FullEditor] Defining FullEditor class, waiting for DOM...');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[FullEditor] DOM ready, creating editor');
        window.editor = new FullEditor();
    });
} else {
    console.log('[FullEditor] DOM already ready, creating editor');
    window.editor = new FullEditor();
}
