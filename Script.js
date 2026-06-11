// ═══════════════════════════
//  PARTÍCULAS — tono cálido
// ═══════════════════════════
const canvas = document.getElementById("particles");
const ctx    = canvas.getContext("2d");
let W, H;

function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener("resize", resize);

// Paleta cálida: dorados, rosados, crema
const COLORS = ["201,151,58","232,168,124","253,220,150","199,107,126","232,200,130"];

function mkParticle(){
    return {
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.25 + 0.06,
        drift: (Math.random()-0.5) * 0.25,
        alpha: Math.random() * 0.45 + 0.12,
        aDir: (Math.random()>0.5?1:-1) * 0.003,
        color: COLORS[Math.floor(Math.random()*COLORS.length)],
        shape: Math.random() > 0.72 ? "star" : "dot",
    };
}

const particles = Array.from({length: 85}, mkParticle);

function drawStar(x, y, r, alpha, color){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Date.now() * 0.0008);
    ctx.beginPath();
    for(let i=0; i<5; i++){
        const a = (i*4*Math.PI/5) - Math.PI/2;
        ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.fill();
    ctx.restore();
}

function tick(){
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
        p.y -= p.speed; p.x += p.drift;
        p.alpha += p.aDir;
        if(p.alpha > 0.6 || p.alpha < 0.07) p.aDir *= -1;
        if(p.y < -10){ p.y = H+10; p.x = Math.random()*W; }
        if(p.x < -10 || p.x > W+10) p.x = Math.random()*W;

        if(p.shape === "star"){
            drawStar(p.x, p.y, p.r*1.5, p.alpha, p.color);
        } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
            ctx.fill();
        }
    });
    requestAnimationFrame(tick);
}
tick();


// ═══════════════════════════
//  HERO ENTRY ANIMATIONS
// ═══════════════════════════
window.addEventListener("load", () => {
    document.querySelectorAll("[data-anim='fadeUp']").forEach(el => {
        const delay = parseInt(el.getAttribute("data-delay") || "0");
        el.style.opacity = "0";
        el.style.transform = "translateY(32px)";
        el.style.transition = "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)";
        setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }, delay);
    });

    setTimeout(() => {
        document.querySelectorAll(".hero-deco").forEach(el => {
            const delay = parseInt(el.getAttribute("data-delay") || "0");
            setTimeout(() => el.classList.add("show"), delay);
        });
    }, 200);
});


// ═══════════════════════════
//  CUENTA REGRESIVA
// ═══════════════════════════
const eventDate = new Date("June 12, 2026 20:00:00").getTime();
const cntEl = document.querySelector(".countdown");

const ival = setInterval(() => {
    const dist = eventDate - Date.now();
    if(dist < 0){
        clearInterval(ival);
        cntEl.innerHTML = `<p style="font-family:'Playfair Display',serif;font-size:2rem;color:#c9973a;text-align:center;padding:1rem;">🎉 ¡La celebración ha comenzado! 🎉</p>`;
        return;
    }
    const d = Math.floor(dist / 86400000);
    const h = Math.floor((dist % 86400000) / 3600000);
    const m = Math.floor((dist % 3600000)  / 60000);
    const s = Math.floor((dist % 60000)    / 1000);

    [[d,"days"],[h,"hours"],[m,"minutes"],[s,"seconds"]].forEach(([val,id]) => {
        const el  = document.getElementById(id);
        const str = String(val).padStart(2,"0");
        if(el.textContent !== str){
            el.textContent = str;
            el.classList.remove("pop");
            void el.offsetWidth;
            el.classList.add("pop");
        }
    });
}, 1000);


// ═══════════════════════════
//  WHATSAPP
// ═══════════════════════════
document.getElementById("confirmar").addEventListener("click", () => {
    const msg = encodeURIComponent(`Hola Nazel 🎂\n\n¡Confirmo mi asistencia a tu cumpleaños! Allí estaré 🥳\n\nNombre:\nCantidad de acompañantes:`);
    window.open(`https://wa.me/59167987586?text=${msg}`, "_blank");
});

document.getElementById("rechazar").addEventListener("click", () => {
    const msg = encodeURIComponent(`Hola Nazel 🎂\n\nLamentablemente no podré asistir a tu cumpleaños 😔\n\nMuchas gracias por la invitación, que lo pases increíble 🎉`);
    window.open(`https://wa.me/59167987586?text=${msg}`, "_blank");
});


// ═══════════════════════════
//  SCROLL REVEAL
// ═══════════════════════════
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
}, { threshold: 0.12 });

document.querySelectorAll(
    ".countdown-section, .glass-card, .info-card, .location, .gift, .rsvp, footer"
).forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = (i * 0.05) + "s";
    obs.observe(el);
});

document.querySelectorAll(".info-card").forEach((el, i) => {
    el.style.transitionDelay = (i * 0.13) + "s";
});


// ═══════════════════════════
//  POP + SHIMMER
// ═══════════════════════════
const sty = document.createElement("style");
sty.textContent = `
@keyframes pop {
    0%  { transform: scale(1); }
    40% { transform: scale(1.2); }
    100%{ transform: scale(1); }
}
.pop { animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
`;
document.head.appendChild(sty);