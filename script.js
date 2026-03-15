const MOLECULES = {
    ch4: { name: '메테인이', formula: 'CH₄', atoms: [{ type: 'C', x: 0, y: 0, color: '#555', radius: 33 }, { type: 'H', x: 0, y: -42, color: '#a0c4ff', radius: 21 }, { type: 'H', x: 0, y: 42, color: '#a0c4ff', radius: 21 }, { type: 'H', x: -42, y: 0, color: '#a0c4ff', radius: 21 }, { type: 'H', x: 42, y: 0, color: '#a0c4ff', radius: 21 }] },
    o2: { name: '산소가', formula: 'O₂', atoms: [{ type: 'O', x: -25, y: 0, color: '#ff4d4d', radius: 33 }, { type: 'O', x: 25, y: 0, color: '#ff4d4d', radius: 33 }] },
    co2: { name: '이산화 탄소가', formula: 'CO₂', atoms: [{ type: 'O', x: -48, y: 0, color: '#ff4d4d', radius: 30 }, { type: 'C', x: 0, y: 0, color: '#555', radius: 33 }, { type: 'O', x: 48, y: 0, color: '#ff4d4d', radius: 30 }] },
    h2o: { name: '물이', formula: 'H₂O', atoms: [{ type: 'O', x: 0, y: -15, color: '#ff4d4d', radius: 33 }, { type: 'H', x: -27, y: 22, color: '#a0c4ff', radius: 24 }, { type: 'H', x: 27, y: 22, color: '#a0c4ff', radius: 24 }] },
    cu: { name: '구리가', formula: 'Cu', atoms: [{ type: 'Cu', x: 0, y: 0, color: '#cd7f32', radius: 33 }] },
    cuo: { name: '산화 구리가', formula: 'CuO', atoms: [{ type: 'Cu', x: -22, y: 0, color: '#cd7f32', radius: 33 }, { type: 'O', x: 22, y: 0, color: '#333', radius: 30 }] },
    h2: { name: '수소가', formula: 'H₂', atoms: [{ type: 'H', x: -22, y: 0, color: '#a0c4ff', radius: 24 }, { type: 'H', x: 22, y: 0, color: '#a0c4ff', radius: 24 }] },
    nh3: { name: '암모니아가', formula: 'NH₃', atoms: [{ type: 'N', x: 0, y: -8, color: '#3b82f6', radius: 33 }, { type: 'H', x: -30, y: 27, color: '#a0c4ff', radius: 21 }, { type: 'H', x: 0, y: 42, color: '#a0c4ff', radius: 21 }, { type: 'H', x: 30, y: 27, color: '#a0c4ff', radius: 21 }] },
    hcl: { name: '염화 수소가', formula: 'HCl', atoms: [{ type: 'H', x: -22, y: 0, color: '#a0c4ff', radius: 21 }, { type: 'Cl', x: 22, y: 0, color: '#22c55e', radius: 33 }] },
    n2: { name: '질소가', formula: 'N₂', atoms: [{ type: 'N', x: -25, y: 0, color: '#3b82f6', radius: 33 }, { type: 'N', x: 25, y: 0, color: '#3b82f6', radius: 33 }] },
    cl2: { name: '염소가', formula: 'Cl₂', atoms: [{ type: 'Cl', x: -25, y: 0, color: '#22c55e', radius: 33 }, { type: 'Cl', x: 25, y: 0, color: '#22c55e', radius: 33 }] }
};

/* --- [MASS ANALYSIS STATION] 원자량 및 질량 계산 데이터 (언제든 삭제 가능) --- */
const ATOMIC_WEIGHTS = {
    'H': 1, 'O': 16, 'C': 12, 'N': 14, 'Cl': 35.5, 'Cu': 63.5
};

function getMoleculeMass(molKey) {
    const mol = MOLECULES[molKey];
    if (!mol) return 0;
    return mol.atoms.reduce((sum, a) => sum + (ATOMIC_WEIGHTS[a.type] || 0), 0);
}
/* --- [MASS ANALYSIS STATION] 데이터 정의 끝 --- */

const REACTIONS = {
    hydrogen: {
        title: '물 합성 반응 (2H₂ + O₂ → 2H₂O)',
        desc: '수소와 산소가 반응하여 물을 생성',
        reactants: [{ key: 'h2', ratio: 2 }, { key: 'o2', ratio: 1 }],
        products: [{ key: 'h2o', ratio: 2 }]
    },
    methane: {
        title: '메테인의 연소 (CH₄ + 2O₂ → CO₂ + 2H₂O)',
        desc: '메테인이 연소되어 이산화 탄소와 물 생성',
        reactants: [{ key: 'ch4', ratio: 1 }, { key: 'o2', ratio: 2 }],
        products: [{ key: 'co2', ratio: 1 }, { key: 'h2o', ratio: 2 }]
    },
    hcl_synthesis: {
        title: '염화 수소 합성 (H₂ + Cl₂ → 2HCl)',
        desc: '수소와 염소가 반응하여 염화 수소를 생성',
        reactants: [{ key: 'h2', ratio: 1 }, { key: 'cl2', ratio: 1 }],
        products: [{ key: 'hcl', ratio: 2 }]
    },
    ammonia_synthesis: {
        title: '암모니아 합성 (N₂ + 3H₂ → 2NH₃)',
        desc: '질소와 수소가 반응하여 암모니아를 생성',
        reactants: [{ key: 'n2', ratio: 1 }, { key: 'h2', ratio: 3 }],
        products: [{ key: 'nh3', ratio: 2 }]
    }
};

const CANVAS_W = 1920;
const CANVAS_H = 900;
const BOX_SIZE = 120;
const SVG_VIEW_W = 160;
const INTERNAL_SCALE = BOX_SIZE / SVG_VIEW_W;

// --- 레이아웃 보정 상수 (전체 위치 조정용) ---
const Y_OFFSET = 140;

const MID_Y_REL = 300 + Y_OFFSET;
const LINE_A_Y = 200 + Y_OFFSET;
const LINE_B_Y = 400 + Y_OFFSET;
const LINE_OUT_Y = 300 + Y_OFFSET;

const QUEUE_RIGHT_X = 535;
const QUEUE_GAP = 122;
const ASSEMBLY_STATION_X = 1140;
const DISSOCIATION_X = 720;
const PRODUCT_START_X = 1260;
const PRODUCT_GAP = 122;

let currentReactionKey = 'hydrogen';

const state = {
    isAnimating: false,
    cycleStep: 0,
    queues: { r0: [], r1: [] },
    activeBoxes: [],
    atomPool: [],
    productBoxes: [],
    assemblyPlan: [],
    cycleCounter: 0,
    cumulativeMass: { r0: 0, r1: 0, p: {} } // p will be { 'h2o': 0, 'co2': 0, ... }
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

// --- 모달 제어 함수 ---
function showModal(title, message) {
    const modal = document.getElementById('custom-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    modal.classList.add('active');
}

document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('custom-modal').classList.remove('active');
});

function getMoleculeSVG(molKey) {
    const mol = MOLECULES[molKey];
    const centerX = SVG_VIEW_W / 2;
    const centerY = 75;

    const atomsHtml = mol.atoms.map((a, i) => `
        <g class="atom" style="transform: translate(${centerX + a.x}px, ${centerY + a.y}px)" data-type="${a.type}">
            <circle cx="0" cy="0" r="${a.radius}" fill="${a.color}" stroke="#333" stroke-width="2" />
            <text x="0" y="${a.radius * 0.3}" text-anchor="middle" fill="${a.color === '#555' || a.color === '#333' ? 'white' : 'black'}" font-size="${a.radius * 0.8}px" font-weight="bold" pointer-events="none">${a.type}</text>
        </g>
    `).join('');
    return `<svg width="100%" height="100%" viewBox="0 0 ${SVG_VIEW_W} 150" class="molecule-svg">${atomsHtml}</svg>`;
}

const particleContainer = document.getElementById('particle-container');
const globalAtomLayer = document.getElementById('global-atom-layer');
const factoryBase = document.getElementById('factory');
const rMetrics = document.getElementById('reactant-metrics');
const pMetrics = document.getElementById('product-metrics');
const actionsDiv = document.getElementById('action-controls');

function applyScaling() {
    const root = document.querySelector('.canvas-root');
    if (!root) return;
    const scale = Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H, 1);
    root.style.position = 'absolute';
    root.style.left = '50%';
    root.style.top = '50%';
    root.style.transformOrigin = 'center';
    root.style.transform = `translate(-50%, -50%) scale(${scale})`;
}
window.addEventListener('resize', applyScaling);
applyScaling();

function renderUIForReaction(reactionKey) {
    currentReactionKey = reactionKey;
    const reaction = REACTIONS[reactionKey];
    state.queues = { r0: [], r1: [] };
    state.activeBoxes = [];
    state.atomPool = [];
    state.productBoxes = [];
    state.assemblyPlan = [];
    state.cycleStep = 0;
    state.isAnimating = false;
    state.cycleCounter = 0;
    state.cumulativeMass = { r0: 0, r1: 0, p: {} };
    reaction.products.forEach(p => {
        state.cumulativeMass.p[p.key] = 0;
    });

    particleContainer.innerHTML = '';
    globalAtomLayer.innerHTML = '';

    updateActionControls();
    updateDashboardCount();
    updateMassAnalysis();
    updateFactoryBlueprint();
}

/* --- [MASS ANALYSIS STATION] 수식형 카드 UI 업데이트 로직 (언제든 삭제 가능) --- */
function updateMassAnalysis() {
    const reaction = REACTIONS[currentReactionKey];
    const rightZone = document.getElementById('mass-equation-display');
    if (!rightZone) return;

    const r0_formula = MOLECULES[reaction.reactants[0].key].formula;
    const r1_formula = MOLECULES[reaction.reactants[1].key].formula;

    const reactantsHtml = `
        <div class="mass-card r0-card">
            <div class="card-label">${r0_formula}</div>
            <div class="card-value">${state.cumulativeMass.r0}<span>g</span></div>
        </div>
        <div class="equation-operator">+</div>
        <div class="mass-card r1-card">
            <div class="card-label">${r1_formula}</div>
            <div class="card-value">${state.cumulativeMass.r1}<span>g</span></div>
        </div>
    `;

    const productsHtml = reaction.products.map((p, idx) => {
        const formula = MOLECULES[p.key].formula;
        const mass = state.cumulativeMass.p[p.key] || 0;
        const card = `
            <div class="mass-card p-card">
                <div class="card-label">${formula}</div>
                <div class="card-value">${mass}<span>g</span></div>
            </div>
        `;
        return idx < reaction.products.length - 1 ? card + '<div class="equation-operator">+</div>' : card;
    }).join('');

    rightZone.innerHTML = `
        <div class="reaction-equation-container">
            ${reactantsHtml}
            <div class="equation-arrow">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </div>
            ${productsHtml}
        </div>
    `;
}
/* --- [MASS ANALYSIS STATION] 로직 끝 --- */

function updateActionControls() {
    const reaction = REACTIONS[currentReactionKey];
    let btnText = state.isAnimating ? "변환 중..." : "변환 시작";

    actionsDiv.innerHTML = reaction.reactants.map((r, i) => `
        <button id="add-r${i}-btn" class="control-btn" style="background: ${i === 0 ? 'var(--accent-blue)' : 'var(--accent-pink)'}" ${state.isAnimating ? 'disabled' : ''}>
            ${MOLECULES[r.key].formula}
        </button>
    `).join('') + `
        <button id="start-btn" class="control-btn" style="background:var(--accent-gold); color:#000;" ${state.isAnimating ? 'disabled' : ''}>${btnText}</button>
        <button id="reset-btn" class="control-btn" style="background: #475569; color: #fff;" ${state.isAnimating ? 'disabled' : ''}>초기화</button>
    `;

    reaction.reactants.forEach((r, i) => {
        const btn = document.getElementById(`add-r${i}-btn`);
        if (btn) btn.addEventListener('click', () => addReactant(i, r.key));
    });
    document.getElementById('start-btn').addEventListener('click', runFactoryCycle);
    document.getElementById('reset-btn').addEventListener('click', () => location.reload());
}

function addReactant(lineIdx, molKey) {
    if (state.isAnimating || state.cycleStep > 0) return;

    const queueIdx = state.queues[`r${lineIdx}`].length;

    const box = document.createElement('div');
    box.className = `box ${molKey}-box`;
    box.style.width = `${BOX_SIZE}px`; box.style.height = `${BOX_SIZE}px`;
    box.innerHTML = getMoleculeSVG(molKey);
    const startY = (lineIdx === 0 ? LINE_A_Y : LINE_B_Y) - BOX_SIZE / 2;
    box.style.left = `-150px`; box.style.top = `${startY}px`;
    particleContainer.appendChild(box);
    state.queues[`r${lineIdx}`].push(box);
    updateDashboardCount();

    setTimeout(() => {
        const targetX = QUEUE_RIGHT_X - queueIdx * QUEUE_GAP;
        box.style.left = `${targetX}px`;
    }, 50);
}

function updateDashboardCount() {
    updateActionControls();
    /* --- MASS ANALYSIS --- */
    updateMassAnalysis();
}

async function runFactoryCycle() {
    if (state.isAnimating) return;
    const reaction = REACTIONS[currentReactionKey];

    // 0. 투입 가능 여부 확인
    let hasEnough = true;
    reaction.reactants.forEach((r, i) => { if (state.queues[`r${i}`].length < r.ratio) hasEnough = false; });
    if (!hasEnough) {
        showModal("반응 불가", "화학 반응에 필요한 재료가 부족합니다! 각 라인의 상자 개수를 확인해 주세요.");
        return;
    }

    state.isAnimating = true;
    updateActionControls();
    factoryBase.classList.add('active');

    // --- STEP 0: INPUT ---
    reaction.reactants.forEach((r, i) => {
        for (let k = 0; k < r.ratio; k++) {
            const box = state.queues[`r${i}`].shift();
            state.activeBoxes.push({ box, molKey: r.key });

            // 기계에 들어가는 순간 질량 업데이트
            state.cumulativeMass[`r${i}`] += getMoleculeMass(r.key);
            updateMassAnalysis();
            const targetX = 680 + ((r.ratio - 1 - k) * 140);
            const targetY = (i === 0 ? LINE_A_Y : LINE_B_Y) - BOX_SIZE / 2;
            setTimeout(() => {
                box.style.left = `${targetX}px`;
                box.style.top = `${targetY}px`;
            }, k * 100);
        }
    });

    reaction.reactants.forEach((r, i) => {
        state.queues[`r${i}`].forEach((box, idx) => {
            box.style.left = `${QUEUE_RIGHT_X - idx * QUEUE_GAP}px`;
        });
    });

    updateDashboardCount();
    await sleep(1500);

    // --- STEP 1: DISSOCIATION ---
    state.activeBoxes.forEach(item => {
        const atoms = Array.from(item.box.querySelectorAll('.atom'));
        const bx = parseFloat(item.box.style.left);
        const by = parseFloat(item.box.style.top);

        atoms.forEach(a => {
            const m = a.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
            const tx = m ? parseFloat(m[1]) : 80;
            const ty = m ? parseFloat(m[2]) : 75;

            const absX = bx + (tx - 80) * INTERNAL_SCALE + BOX_SIZE / 2;
            const absY = by + (ty - 75) * INTERNAL_SCALE + BOX_SIZE / 2;

            globalAtomLayer.appendChild(a);
            a.style.transition = 'none';
            a.style.transform = `translate(${absX}px, ${absY}px) scale(${INTERNAL_SCALE})`;
            void a.offsetWidth;
            a.style.transition = 'transform 0.8s cubic-bezier(0.3, 0, 0.2, 1)';
            state.atomPool.push({ dom: a, type: a.dataset.type });
        });

        item.box.classList.add('unboxed');
        setTimeout(() => item.box.remove(), 800);
    });

    await sleep(400);
    state.atomPool.sort((a, b) => a.type.localeCompare(b.type));
    state.atomPool.forEach((atom, idx) => {
        const rows = 3;
        const col = Math.floor(idx / rows);
        const row = idx % rows;
        // 보정값 MID_Y_REL을 기준으로 원자 그리드 배치
        const targetX = DISSOCIATION_X + col * 85;
        const rowGap = 100; // 간격을 조금 좁혀 기계 내부에 더 잘 머물게 함
        const targetY = MID_Y_REL - rowGap + row * rowGap;
        atom.dom.style.transform = `translate(${targetX}px, ${targetY}px) scale(${INTERNAL_SCALE})`;
    });

    await sleep(1200);
    state.assemblyPlan = [];
    reaction.products.forEach(p => { for (let k = 0; k < p.ratio; k++) state.assemblyPlan.push(p); });
    state.activeBoxes = [];

    // --- STEP 2: ASSEMBLY LOOP ---
    while (state.assemblyPlan.length > 0) {
        const prod = state.assemblyPlan.shift();
        const pBox = document.createElement('div');
        pBox.className = `box ${prod.key}-box`;
        pBox.style.width = `${BOX_SIZE}px`; pBox.style.height = `${BOX_SIZE}px`;
        pBox.style.left = `${ASSEMBLY_STATION_X}px`;
        pBox.style.top = `${LINE_OUT_Y - BOX_SIZE / 2}px`;
        pBox.style.opacity = '0';
        particleContainer.appendChild(pBox);

        const pSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        pSvg.setAttribute('viewBox', `0 0 ${SVG_VIEW_W} 150`);
        pSvg.setAttribute('width', '100%'); pSvg.setAttribute('height', '100%');
        pSvg.classList.add('molecule-svg');
        pBox.appendChild(pSvg);

        pBox.style.transition = 'opacity 0.5s';
        void pBox.offsetWidth; pBox.style.opacity = '1';

        await sleep(400);
        const needed = MOLECULES[prod.key].atoms;
        const targetAtoms = [];
        needed.forEach(n => {
            const matchIdx = state.atomPool.findIndex(a => a.type === n.type);
            if (matchIdx !== -1) {
                const match = state.atomPool.splice(matchIdx, 1)[0];
                targetAtoms.push({ atom: match, offset: n });
            }
        });

        targetAtoms.forEach(ta => {
            const targetX = ASSEMBLY_STATION_X + ta.offset.x * INTERNAL_SCALE + BOX_SIZE / 2;
            const targetY = LINE_OUT_Y + ta.offset.y * INTERNAL_SCALE;
            ta.atom.dom.style.transform = `translate(${targetX}px, ${targetY}px) scale(${INTERNAL_SCALE})`;
        });

        await sleep(800);

        targetAtoms.forEach(ta => {
            pSvg.appendChild(ta.atom.dom);
            ta.atom.dom.style.transition = 'none';
            ta.atom.dom.style.transform = `translate(${SVG_VIEW_W / 2 + ta.offset.x}px, ${75 + ta.offset.y}px)`;
        });

        await sleep(100);

        pBox.style.transition = 'left 0.8s ease-in-out';
        pBox.style.left = `${PRODUCT_START_X}px`;

        state.productBoxes.forEach((oldBox, idx) => {
            const posInQueue = state.productBoxes.length - idx;
            oldBox.style.transition = 'left 0.8s ease-in-out';
            oldBox.style.left = `${PRODUCT_START_X + posInQueue * PRODUCT_GAP}px`;
        });

        state.productBoxes.push(pBox);
        state.cumulativeMass.p[prod.key] += getMoleculeMass(prod.key);
        updateMassAnalysis();

        await sleep(200);
    }

    // --- FINALIZE ---
    state.cycleCounter++;
    factoryBase.classList.remove('active');
    state.isAnimating = false;
    updateActionControls();
    updateMassAnalysis();
    updateFactoryBlueprint();
}

/* --- 기계 상단 조립 설명서 (Blueprint) 업데이트 --- */
function updateFactoryBlueprint() {
    const blueprintDiv = document.getElementById('factory-blueprint');
    if (!blueprintDiv) return;
    const reaction = REACTIONS[currentReactionKey];

    const reactantsHtml = reaction.reactants.map((r, idx) => {
        let group = '<div class="bp-group">';
        for (let i = 0; i < r.ratio; i++) {
            group += `<div class="bp-box">${getMoleculeSVG(r.key)}</div>`;
        }
        group += '</div>';
        return idx < reaction.reactants.length - 1 ? group + '<div class="bp-operator">+</div>' : group;
    }).join('');

    const productsHtml = reaction.products.map((p, idx) => {
        let group = '<div class="bp-group">';
        for (let i = 0; i < p.ratio; i++) {
            group += `<div class="bp-box">${getMoleculeSVG(p.key)}</div>`;
        }
        group += '</div>';
        return idx < reaction.products.length - 1 ? group + '<div class="bp-operator">+</div>' : group;
    }).join('');

    blueprintDiv.innerHTML = `
        <div style="position:absolute; top:-18px; left:15px; font-size:0.65rem; color:#38bdf8; font-weight:700; letter-spacing:1px; background:#0f172a; padding:0 8px;">ASSEMBLY BLUEPRINT</div>
        ${reactantsHtml}
        <div class="bp-arrow">→</div>
        ${productsHtml}
    `;
}

renderUIForReaction('hydrogen');
document.getElementById('reaction-selector').addEventListener('change', (e) => {
    renderUIForReaction(e.target.value);
});
