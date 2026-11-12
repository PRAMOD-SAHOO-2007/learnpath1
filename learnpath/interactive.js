const COURSES = [
    { id: "python", ic: "🐍", name: "Python", lvl: "Beginner", wk: 6, d: "Learn clean, readable programming used in automation, data and AI.", syl: ["Syntax, variables & control flow", "Functions, modules & OOP", "File handling & exceptions", "Libraries: NumPy, Requests", "Mini project: CLI tool"] },
    { id: "c", ic: "🔧", name: "C Programming", lvl: "Beginner", wk: 5, d: "Understand how computers work with pointers, memory and low‑level logic.", syl: ["Data types & operators", "Arrays, strings & functions", "Pointers & dynamic memory", "Structures & file I/O", "Project: Student record system"] },
    { id: "cpp", ic: "⚙️", name: "C++", lvl: "Intermediate", wk: 7, d: "Object‑oriented and high‑performance programming with the STL.", syl: ["Classes, objects & inheritance", "Templates & operator overloading", "STL: vector, map, set", "Memory management & RAII", "Project: Library manager"] },
    { id: "java", ic: "☕", name: "Java", lvl: "Intermediate", wk: 8, d: "Build robust applications with OOP, collections and multithreading.", syl: ["OOP principles & interfaces", "Collections & generics", "Exceptions & streams", "Multithreading", "Project: Banking app"] },
    { id: "dsa", ic: "🧩", name: "Data Structures & Algorithms", lvl: "Intermediate", wk: 10, d: "Crack interviews with core structures and problem‑solving patterns.", syl: ["Arrays, linked lists, stacks, queues", "Trees, heaps & graphs", "Sorting & searching", "Recursion & dynamic programming", "100 practice problems"] },
    { id: "devops", ic: "🚀", name: "DevOps", lvl: "Intermediate", wk: 8, d: "Automate build, test and deployment with modern tooling.", syl: ["Linux & Git workflows", "CI/CD with pipelines", "Docker & Kubernetes", "Infrastructure as Code", "Monitoring & logging"] },
    { id: "cloud", ic: "☁️", name: "Cloud Computing", lvl: "Intermediate", wk: 6, d: "Deploy scalable apps on the cloud with core services.", syl: ["Cloud models: IaaS, PaaS, SaaS", "Compute, storage & databases", "IAM & security", "Serverless & containers", "Project: Host a 3‑tier app"] },
    { id: "net", ic: "🌐", name: "Networking", lvl: "Beginner", wk: 5, d: "Understand how data travels across the internet.", syl: ["OSI & TCP/IP models", "IP addressing & subnetting", "DNS, HTTP, TLS", "Routing & switching", "Troubleshooting tools"] },
    { id: "sd", ic: "🏗️", name: "System Design", lvl: "Advanced", wk: 8, d: "Design scalable, reliable systems like top tech companies.", syl: ["Scalability & load balancing", "Caching & databases", "Queues & microservices", "CAP theorem & consistency", "Case studies: URL shortener, chat"] },
    { id: "git", ic: "🌿", name: "Git & GitHub", lvl: "Beginner", wk: 2, d: "Version control and collaboration skills every developer needs.", syl: ["Init, commit & history", "Branching & merging", "Remotes, push & pull", "Pull requests & code review", "Project: Open-source contribution"] },
    { id: "web", ic: "🌍", name: "Web Development", lvl: "Beginner", wk: 8, d: "Build responsive websites with HTML, CSS and JavaScript.", syl: ["HTML5 & semantic markup", "CSS, Flexbox & Grid", "JavaScript & the DOM", "Fetch APIs & async code", "Project: Portfolio website"] },
    { id: "sql", ic: "🗄️", name: "SQL & Databases", lvl: "Beginner", wk: 5, d: "Store, query and design data with relational databases.", syl: ["SELECT, WHERE & ORDER BY", "Joins & aggregations", "Normalization & schema design", "Indexes & transactions", "Project: Library database"] },
    { id: "os", ic: "💻", name: "Operating Systems", lvl: "Intermediate", wk: 6, d: "Learn how processes, memory and files work inside your computer.", syl: ["Processes & threads", "CPU scheduling", "Deadlocks & synchronization", "Memory management & paging", "File systems"] },
    { id: "sec", ic: "🛡️", name: "Cybersecurity", lvl: "Intermediate", wk: 7, d: "Protect systems and data with security fundamentals.", syl: ["Threats & attack types", "Cryptography basics", "Web security: XSS, SQLi", "Network defense & firewalls", "Ethical hacking labs"] },
    { id: "ml", ic: "🤖", name: "Machine Learning", lvl: "Advanced", wk: 10, d: "Train models that learn from data using Python.", syl: ["Data preprocessing", "Regression & classification", "Model evaluation", "Neural network basics", "Project: Prediction app"] }
];
const PATH = ["python", "c", "cpp", "java", "git", "web", "sql", "dsa", "os", "net", "cloud", "devops", "sec", "sd", "ml"];
const $ = s => document.querySelector(s);
const ls = {
    get(k, d) {
        try {
            const v = localStorage.getItem(k);
            return v ? JSON.parse(v) : d;
        }
        catch (e) {
            return d;
        }
    }, set(k, v) {
        try {
            localStorage.setItem(k, JSON.stringify(v));
        }
        catch (e) {
        }
    }
};
let mem = { users: ls.get("lp_users", {}), user: ls.get("lp_user", null), enr: ls.get("lp_enr", {}) };
let otpState = null;
function toast(m, t = 6000) {
    const e = $("#toast");
    e.textContent = m;
    e.style.display = "block";
    clearTimeout(toast.t);
    toast.t = setTimeout(() => e.style.display = "none", t);
}
function open(h) {
    $("#modal").innerHTML = '<button class="x" aria-label="Close" onclick="closeM()">×</button>' + h;
    $("#ov").classList.add("open");
}
function closeM() {
    $("#ov").classList.remove("open");
    otpState = null;
}
$("#ov").addEventListener("click", e => {
    if (e.target.id === "ov")
        closeM();
});
document.addEventListener("keydown", e => {
    if (e.key === "Escape")
        closeM();
});
const okEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const okMob = v => /^[6-9]\d{9}$/.test(v) || /^\+?\d{10,13}$/.test(v);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function sendOtp(email) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    otpState = { email, code, exp: Date.now() + 300000, tries: 0 };
    toast("Demo email OTP for " + email + ": " + code, 15000);
}
function checkOtp(v) {
    if (!otpState)
        return "Please request an OTP first.";
    if (Date.now() > otpState.exp)
        return "OTP expired. Please resend.";
    if (++otpState.tries > 5)
        return "Too many attempts. Please resend OTP.";
    return v === otpState.code ? "" : "Incorrect OTP. Try again.";
}
function renderNav() {
    const u = mem.user;
    $("#nav").innerHTML = u ? `<span class="small">Hi, ${esc(u.name.split(" ")[0])}</span><button class="btn ghost" onclick="logout()">Logout</button>`
        : `<button class="btn ghost" onclick="authM('login')">Login</button><button class="btn" onclick="authM('signup')">Sign up</button>`;
}
function renderPath() {
    const P = GOALS[goal] || PATH;
    $("#path").innerHTML = P.map((id, i) => {
        const c = COURSES.find(x => x.id === id);
        return `<div class="step" style="cursor:pointer" onclick="detail('${id}')"><span class="n">${i + 1}</span>${c.name.replace(" Programming", "")}${i < P.length - 1 ? "<i></i>" : ""}</div>`;
    }).join("");
}
function renderGrid() {
    const e = u => u && mem.enr[u.email] || [];
    const mine = e(mem.user);
    const q = ($("#q") ? $("#q").value : "").toLowerCase();
    $("#grid").innerHTML = COURSES.filter(c => (curLvl === "All" || c.lvl === curLvl) && (c.name + " " + c.d).toLowerCase().includes(q)).map(c => `<button class="card" style="--h:${(COURSES.indexOf(c) * 26 + 235) % 360};animation-delay:${COURSES.indexOf(c) * 40}ms" onclick="detail('${c.id}')"><div class="ic">${c.ic}</div><h3>${c.name}</h3><p>${c.d}</p><div class="tags"><span class="tag">${c.lvl}</span><span class="tag">${c.wk} weeks</span>${goal !== "all" && GOALS[goal].includes(c.id) ? '<span class="tag ok">★ For your goal</span>' : ""}${mine.includes(c.id) ? '<span class="tag ok">Enrolled ✓</span>' : ""}</div></button>`).join("");
    renderDash(mine);
}
function detail(id) {
    const c = COURSES.find(x => x.id === id);
    const done = mem.user && (mem.enr[mem.user.email] || []).includes(id);
    open(`<div class="crumb">Courses › ${c.name} (${COURSES.indexOf(c) + 1} of ${COURSES.length})</div><h2>${c.ic} ${c.name}</h2><div class="meta"><span class="tag">${c.lvl}</span><span class="tag">${c.wk} weeks</span><span class="tag">Certificate</span></div><p>${c.d}</p><strong>What you’ll learn</strong>${done ? `<div>${c.syl.map((s, i) => `<label class="chk"><input type="checkbox" ${prog(id).includes(i) ? "checked" : ""} onchange="tick('${id}',${i},this.checked)"><span>${s}</span></label>`).join("")}</div><div class="bar"><i id="pb" style="width:${pct(id)}%"></i></div><p class="small">Tick lessons as you finish them to track your progress.</p><div id="cert">${pct(id) === 100 ? certBtn(id) : ""}</div>` : `<ul class="syl">${c.syl.map(s => `<li>${s}</li>`).join("")}</ul>`}${done ? '<p class="tag ok" style="display:inline-block">You are enrolled ✓</p>' : `<button class="btn full" onclick="enrollForm('${id}')">Enroll now</button>`}<div class="pn"><button class="btn ghost" onclick="detail('${nb(c, -1).id}')">← ${nb(c, -1).name}</button><button class="btn ghost" onclick="detail('${nb(c, 1).id}')">${nb(c, 1).name} →</button></div>`);
}
function authM(mode) {
    otpState = null;
    open(`<div class="tabs"><button class="btn ${mode === "login" ? "" : "ghost"}" onclick="authM('login')">Login</button><button class="btn ${mode === "signup" ? "" : "ghost"}" onclick="authM('signup')">Sign up</button></div>
  <div id="af">${mode === "signup" ? `<label>Full name</label><input id="n" autocomplete="name" placeholder="Your name"><label>Mobile number</label><input id="m" type="tel" inputmode="tel" autocomplete="tel" placeholder="10‑digit mobile">` : ""}
  <label>Email</label><input id="e" type="email" autocomplete="email" placeholder="you@example.com">
  <div class="err" id="er"></div><button class="btn full" onclick="authSend('${mode}')">Send email OTP</button></div>`);
}
function authSend(mode) {
    const e = $("#e").value.trim().toLowerCase(), n = mode === "signup" ? $("#n").value.trim() : "", m = mode === "signup" ? $("#m").value.trim() : "";
    const er = t => $("#er").textContent = t;
    if (mode === "signup") {
        if (n.length < 2)
            return er("Enter your full name.");
        if (!okMob(m))
            return er("Enter a valid mobile number.");
    }
    if (!okEmail(e))
        return er("Enter a valid email address.");
    if (mode === "signup" && mem.users[e])
        return er("Account exists. Please login.");
    if (mode === "login" && !mem.users[e])
        return er("No account found. Please sign up.");
    sendOtp(e);
    $("#af").innerHTML = `<p class="small">We sent a 6‑digit OTP to <b>${esc(e)}</b>.</p><label>Enter OTP</label><input id="o" class="otp" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><div class="err" id="er"></div><button class="btn full" onclick="authVerify('${mode}','${esc(n)}','${esc(m)}')">Verify &amp; ${mode === "signup" ? "create account" : "login"}</button><p class="small"><button class="link" onclick="sendOtp('${e}')">Resend OTP</button></p>`;
}
function authVerify(mode, n, m) {
    const r = checkOtp($("#o").value.trim());
    if (r)
        return $("#er").textContent = r;
    const e = otpState.email;
    if (mode === "signup") {
        mem.users[e] = { name: n, email: e, mobile: m };
        ls.set("lp_users", mem.users);
    }
    mem.user = mem.users[e];
    ls.set("lp_user", mem.user);
    closeM();
    renderNav();
    renderGrid();
    toast("Welcome, " + mem.user.name + "! You are logged in.", 3500);
}
function logout() {
    mem.user = null;
    ls.set("lp_user", null);
    renderNav();
    renderGrid();
    toast("Logged out.", 2500);
}
function enrollForm(id) {
    const c = COURSES.find(x => x.id === id), u = mem.user || {};
    otpState = null;
    open(`<h2>Enroll in ${c.name}</h2><div id="ef"><label>Full name</label><input id="n" autocomplete="name" value="${esc(u.name || "")}"><label>Email</label><input id="e" type="email" autocomplete="email" value="${esc(u.email || "")}"><label>Mobile number</label><input id="m" type="tel" inputmode="tel" autocomplete="tel" value="${esc(u.mobile || "")}"><div class="err" id="er"></div><button class="btn full" onclick="enSend('${id}')">Send email OTP</button></div>`);
}
function enSend(id) {
    const n = $("#n").value.trim(), e = $("#e").value.trim().toLowerCase(), m = $("#m").value.trim(), er = t => $("#er").textContent = t;
    if (n.length < 2)
        return er("Enter your name.");
    if (!okEmail(e))
        return er("Enter a valid email.");
    if (!okMob(m))
        return er("Enter a valid mobile number.");
    sendOtp(e);
    $("#ef").innerHTML = `<p class="small">Enter the OTP sent to <b>${esc(e)}</b> to confirm enrollment.</p><label>Email OTP</label><input id="o" class="otp" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><div class="err" id="er"></div><button class="btn full" onclick="enDone('${id}','${esc(n)}','${esc(m)}')">Verify &amp; enroll</button><p class="small"><button class="link" onclick="sendOtp('${e}')">Resend OTP</button></p>`;
}
function enDone(id, n, m) {
    const r = checkOtp($("#o").value.trim());
    if (r)
        return $("#er").textContent = r;
    const e = otpState.email;
    if (!mem.users[e]) {
        mem.users[e] = { name: n, email: e, mobile: m };
        ls.set("lp_users", mem.users);
    }
    mem.user = mem.users[e];
    ls.set("lp_user", mem.user);
    const l = mem.enr[e] || [];
    if (!l.includes(id))
        l.push(id);
    mem.enr[e] = l;
    ls.set("lp_enr", mem.enr);
    const c = COURSES.find(x => x.id === id);
    open(`<div class="ok-box"><div class="big">🎉</div><h2>Enrolled successfully!</h2><p>${esc(n)}, you are now enrolled in <b>${c.name}</b>. A confirmation has been sent to ${esc(e)}.</p><button class="btn full" onclick="closeM()">Start learning</button></div>`);
    renderNav();
    renderGrid();
}
let curLvl = "All";
mem.prog = ls.get("lp_prog", {});
const key = () => mem.user ? mem.user.email : "";
const prog = id => (mem.prog[key()] || {})[id] || [];
const pct = id => Math.round(prog(id).length / COURSES.find(x => x.id === id).syl.length * 100);
function tick(id, i, on) {
    const k = key(), p = mem.prog[k] || {}, s = new Set(p[id] || []);
    on ? s.add(i) : s.delete(i);
    p[id] = [...s];
    mem.prog[k] = p;
    ls.set("lp_prog", mem.prog);
    $("#pb").style.width = pct(id) + "%";
    $("#cert").innerHTML = pct(id) === 100 ? certBtn(id) : "";
    renderDash(mem.enr[k] || []);
    if (on && pct(id) === 100)
        toast("🏆 Course completed: " + COURSES.find(x => x.id === id).name, 4000);
}
function setLvl(l) {
    curLvl = l;
    document.querySelectorAll(".chip[data-l]").forEach(b => b.classList.toggle("on", b.dataset.l === l));
    renderGrid();
}
function renderDash(mine) {
    if (!mine.length) {
        $("#mine").innerHTML = "";
        return;
    }
    const ps = mine.map(pct), avg = Math.round(ps.reduce((a, b) => a + b, 0) / ps.length), lessons = mine.reduce((a, id) => a + prog(id).length, 0), done = ps.filter(p => p === 100).length;
    const lab = avg >= 70 ? "Top performer 🏆" : avg >= 30 ? "On track 👍" : "Getting started 🚀";
    const xp = lessons * 10 + done * 50 + mine.length * 20, lvl = Math.floor(xp / 100) + 1;
    const bd = [[mine.length >= 1, "🌱 First step"], [lessons >= 5, "📚 5 lessons"], [lessons >= 10, "🔥 10 lessons"], [mine.length >= 3, "🚀 3 courses"], [done >= 1, "🏆 Graduate"]];
    const badges = bd.map(([ok, t]) => `<span class="tag ${ok ? "ok" : ""}" style="${ok ? "" : "opacity:.45"}">${t}</span>`).join("");
    $("#mine").innerHTML = `<h2>My performance</h2><div class="dash"><div><div class="ring" style="background:conic-gradient(var(--brand) ${avg * 3.6}deg,var(--line) 0)"><div>${avg}%</div></div><div class="kpis"><span class="tag">${lessons} lessons done</span><span class="tag">${done} completed</span></div><p class="small" style="text-align:center;margin:8px 0 0"><b>${lab}</b></p><p class="small" style="text-align:center;margin:4px 0"><b>Level ${lvl}</b> · ${xp} XP</p><div class="bar"><i style="width:${xp % 100}%"></i></div><div class="kpis">${badges}</div></div><div>${mine.map((id, i) => {
        const c = COURSES.find(x => x.id === id);
        return `<div class="row" onclick="detail('${id}')"><b>${c.ic} ${c.name}</b> <span class="small">· ${ps[i]}%</span><div class="bar"><i style="width:${ps[i]}%"></i></div></div>`;
    }).join("")}</div></div>`;
}
$("#stats").innerHTML = `<div class="stat"><b>${COURSES.length}</b>Courses</div><div class="stat"><b>${COURSES.reduce((a, c) => a + c.syl.length, 0)}</b>Lessons</div><div class="stat"><b>${COURSES.reduce((a, c) => a + c.wk, 0)}</b>Weeks of content</div><div class="stat"><b>Free</b>Enrollment</div>`;
let goal = "all";
const GOALS = { job: ["c", "java", "cpp", "dsa", "os", "sql", "sd"], web: ["git", "web", "sql", "python", "cloud", "sd"], cloud: ["python", "git", "net", "cloud", "devops", "sec"], ai: ["python", "sql", "dsa", "ml"] };
function setGoal(g) {
    goal = g;
    document.querySelectorAll(".chip[data-g]").forEach(b => b.classList.toggle("on", b.dataset.g === g));
    renderPath();
    renderGrid();
}
function toggleTheme(e) {
    e.preventDefault();
    const r = document.documentElement, cur = r.dataset.theme || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
    r.dataset.theme = cur === "dark" ? "light" : "dark";
}
const certBtn = id => `<button class="btn full" style="margin-top:8px" onclick="cert('${id}')">🎓 Get your certificate</button>`;
function cert(id) {
    const c = COURSES.find(x => x.id === id), u = mem.user || { name: "Learner" }, cv = document.createElement("canvas");
    cv.width = 1000;
    cv.height = 680;
    const g = cv.getContext("2d");
    g.fillStyle = "#fff";
    g.fillRect(0, 0, 1000, 680);
    const gr = g.createLinearGradient(0, 0, 1000, 0);
    gr.addColorStop(0, "#4f46e5");
    gr.addColorStop(1, "#7c3aed");
    g.strokeStyle = gr;
    g.lineWidth = 14;
    g.strokeRect(24, 24, 952, 632);
    g.lineWidth = 2;
    g.strokeRect(44, 44, 912, 592);
    g.textAlign = "center";
    g.fillStyle = "#4f46e5";
    g.font = "bold 28px sans-serif";
    g.fillText("🎓 LEARNPATH", 500, 120);
    g.fillStyle = "#14182b";
    g.font = "bold 52px Georgia,serif";
    g.fillText("Certificate of Completion", 500, 210);
    g.font = "22px sans-serif";
    g.fillStyle = "#5d6480";
    g.fillText("This is proudly presented to", 500, 280);
    g.fillStyle = "#14182b";
    g.font = "italic bold 56px Georgia,serif";
    g.fillText(u.name, 500, 360);
    g.font = "22px sans-serif";
    g.fillStyle = "#5d6480";
    g.fillText("for successfully completing the course", 500, 420);
    g.fillStyle = "#4f46e5";
    g.font = "bold 42px sans-serif";
    g.fillText(c.name, 500, 490);
    g.fillStyle = "#5d6480";
    g.font = "18px sans-serif";
    g.fillText(new Date().toLocaleDateString() + " · Certificate ID PRAMOD SAHOO 2007 -" + Date.now().toString(36).toUpperCase(), 500, 590);
    const url = cv.toDataURL("image/png");
    open(`<h2>🎓 Your certificate</h2><img src="${url}" alt="Certificate" style="width:100%;border-radius:8px;border:1px solid var(--line)"><a class="btn full" style="display:block;text-align:center;text-decoration:none;margin-top:10px" href="${url}" download="LearnPath-${c.id}-certificate.png">Download PNG</a><p class="small">If the download doesn’t start, press and hold (or right‑click) the image to save it.</p>`);
}
const TW = ["system design", "Machine Learning", "Cloud & DevOps", "your dream job"];
let ti = 0;
setInterval(() => {
    ti = (ti + 1) % TW.length;
    $("#typed").textContent = TW[ti];
}, 2200);
const nb = (c, d) => COURSES[(COURSES.indexOf(c) + d + COURSES.length) % COURSES.length];
function go(e, id) {
    e.preventDefault();
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}
const SECS = ["home", "roadmap", "courses", "why", "faq"];
addEventListener("scroll", () => {
    $("#top").style.display = scrollY > 500 ? "block" : "none";
    let cur = "home";
    SECS.forEach(s => {
        if (document.getElementById(s).getBoundingClientRect().top < 140)
            cur = s;
    });
    document.querySelectorAll(".links a").forEach(a => a.classList.toggle("on", a.dataset.s === cur));
}, { passive: true });
document.documentElement.dataset.theme = "dark";
renderNav();
renderPath();
renderGrid();
 
