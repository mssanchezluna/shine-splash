(function() {
if (window.top !== window) return;
if (window.__shineSplash) return;
window.__shineSplash = true;
var DEMO = !!window.SHINE_DEMO;          // en la página de prueba se muestra siempre
var p = location.pathname.replace(/\/+$/, '');
if (!DEMO && p !== '' && p !== '/index.php') return;      // solo en la página de inicio
try { if (!DEMO && sessionStorage.getItem('shineVisto')) return; } catch (e) {}

var DESTINO = '';                       // vacío: al entrar se ve el sitio actual. Con una URL, lleva a esa página
var UMBRAL = 0.96;                      // fracción de las letras que hay que descubrir (0 a 1)
var OSCURO = '#0e0c0c';
// Fuente: TeX Gyre Adventor (clon libre de ITC Avant Garde Gothic, licencia GUST), recortada e incluida acá mismo
var FUENTE_DATOS = 'data:font/woff;base64,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';
var FUENTE = '"Adventor", "ITC Avant Garde Gothic", "Avant Garde", "URW Gothic", "Century Gothic", Futura, sans-serif';
var ANCHO = 0.86, ALTO_TITULO = 0.5;    // SHINE: hasta el 86 % del ancho y el 50 % del alto de la pantalla
var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

var tapa = document.createElement('style');
tapa.textContent = 'html{background:' + OSCURO + '}body{visibility:hidden}';
document.head.appendChild(tapa);
function iniciar() {
tapa.textContent = '';


var st = document.createElement('style');
st.textContent =
  '@font-face{font-family:"Adventor";src:url(' + FUENTE_DATOS + ') format("woff");font-weight:normal;font-style:normal;font-display:block}' +
  '#shine-lab{position:fixed;inset:0;z-index:2147483000;background:' + OSCURO + ';overflow:hidden;cursor:crosshair;touch-action:none;transition:opacity .8s ease}' +
  '#shine-lab.sh-saliendo{opacity:0;pointer-events:none}' +
  '#shine-lab.sh-completo{cursor:pointer}' +
  '#shine-lab .sh-texto{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);' +
  'color:#210e0e;font-family:' + FUENTE + ';font-weight:normal;text-transform:uppercase;' +
  'line-height:1;visibility:hidden;-webkit-user-select:none;user-select:none}' +
  '#shine-lab .sh-texto > div{display:block;width:max-content;white-space:nowrap}' +
  '#shine-lab .sh-titulo{letter-spacing:-.045em}' +
  '#shine-lab .sh-linea{margin-top:.9em;letter-spacing:.06em}' +
  '#shine-lab .sh-firma{margin-top:2.2em;letter-spacing:.3em}' +
  '#shine-lab canvas{position:absolute;inset:0;width:100%;height:100%}' +
  '#shine-lab .sh-pista{position:absolute;left:0;right:0;bottom:9vh;text-align:center;z-index:2;pointer-events:none;opacity:0;transition:opacity 1s ease;' +
  'font-family:' + FUENTE + ';font-size:clamp(11px,1.2vw,15px);letter-spacing:.38em;text-transform:uppercase;color:rgba(200,255,180,.75);text-shadow:0 0 10px rgba(170,255,150,.6)}' +
  '#shine-lab.sh-pista-on .sh-pista{opacity:.7}' +
  '#shine-lab.sh-sinpista .sh-pista,#shine-lab.sh-completo .sh-pista{opacity:0}' +
  '#shine-lab .sh-entrar{all:unset;box-sizing:border-box;position:absolute;left:50%;bottom:9vh;transform:translateX(-50%);z-index:2;cursor:pointer;white-space:nowrap;' +
  'font-family:' + FUENTE + ';font-size:clamp(13px,1.5vw,20px);letter-spacing:.38em;text-transform:uppercase;color:#e6ffd9;' +
  'text-shadow:0 0 8px rgba(170,255,150,.9),0 0 24px rgba(170,255,150,.6);padding:.9em 1.4em .9em calc(1.4em + .38em);' +
  'border:1px solid rgba(190,255,170,.55);border-radius:99px;visibility:hidden;opacity:0;transition:opacity .6s ease .9s,visibility 0s linear .9s}' +
  '#shine-lab .sh-entrar:focus-visible{outline:2px solid #e6ffd9;outline-offset:4px}' +
  '#shine-lab.sh-completo .sh-entrar{visibility:visible;opacity:1;animation:sh-late 2.4s ease-in-out 1.6s infinite}' +
  '@keyframes sh-late{0%,100%{opacity:.7}50%{opacity:1}}' +
  '@media (prefers-reduced-motion:reduce){#shine-lab{transition:none}#shine-lab.sh-completo .sh-entrar{animation:none}}';
document.head.appendChild(st);

var raiz = document.createElement('div');
raiz.id = 'shine-lab';
raiz.setAttribute('role', 'group');
raiz.setAttribute('aria-label', 'SHINE. Fito Páez. Mejor disco de rock Latin Grammy 2026. Gracias');
raiz.innerHTML = '<div class="sh-texto"><div class="sh-titulo">SHINE</div><div class="sh-linea">Fito Páez. Mejor disco de rock Latin Grammy 2026</div><div class="sh-firma">Gracias</div></div><div class="sh-pista">Pasá la luz por el texto</div><button class="sh-entrar" type="button">Pulsá para entrar</button>';
document.body.appendChild(raiz);        // encima de todo el sitio
document.documentElement.style.overflow = 'hidden';
var texto = raiz.querySelector('.sh-texto');
var titulo = raiz.querySelector('.sh-titulo'), linea = raiz.querySelector('.sh-linea'), firma = raiz.querySelector('.sh-firma');
var lienzo = document.createElement('canvas');
raiz.insertBefore(lienzo, raiz.firstChild);
var c = lienzo.getContext('2d');

var m = { x: -9999, y: -9999, adentro: false };
raiz.addEventListener('pointermove', function(e) { m.x = e.clientX; m.y = e.clientY; m.adentro = true; });
raiz.addEventListener('pointerdown', function(e) { m.x = e.clientX; m.y = e.clientY; m.adentro = true; });
raiz.addEventListener('pointerleave', function() { m.adentro = false; m.x = m.y = -9999; });
raiz.addEventListener('pointerup', function(e) { if (e.pointerType === 'touch') { m.adentro = false; m.x = m.y = -9999; } });

var W, H, dpr, glifos, carga = null, visto = null, nVistos = 0;
var completo = false, entrando = false, cuadro = null;

function completar() {
  if (completo) return;
  completo = true;
  raiz.classList.add('sh-completo');
}
function entrar() {
  if (!completo || entrando) return;
  entrando = true;
  window.removeEventListener('keydown', teclas);   // el sitio vuelve a usar Enter y espacio normalmente
  raiz.classList.add('sh-saliendo');
  try { sessionStorage.setItem('shineVisto', '1'); } catch (e) {}
  setTimeout(function() {
    if (DESTINO) { window.location.href = DESTINO; return; }
    document.documentElement.style.overflow = '';
    if (raiz.parentNode) raiz.parentNode.removeChild(raiz);
    cuadro = null;
  }, quieto ? 50 : 800);
}
raiz.addEventListener('click', entrar);
function teclas(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  if (completo) entrar(); else completar();
}
window.addEventListener('keydown', teclas);
setTimeout(function() { raiz.classList.add('sh-pista-on'); }, 2500);

function ajustar() {
  var w = raiz.clientWidth, h = raiz.clientHeight;
  titulo.style.fontSize = '100px';
  var fs = 100 * (w * ANCHO) / titulo.getBoundingClientRect().width;
  fs = Math.min(fs, h * ALTO_TITULO);
  titulo.style.fontSize = fs + 'px';
  var anchoTitulo = titulo.getBoundingClientRect().width;
  if (linea) {
    linea.style.fontSize = '100px';
    var fl = Math.max(11, 100 * anchoTitulo / linea.getBoundingClientRect().width);
    linea.style.fontSize = fl + 'px';
    if (firma) firma.style.fontSize = fl + 'px';
  }
}

function medir() {
  ajustar();
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = raiz.clientWidth; H = raiz.clientHeight;
  lienzo.width = W * dpr; lienzo.height = H * dpr;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  glifos = [];
  var rango = document.createRange(), recorrido = document.createTreeWalker(texto, NodeFilter.SHOW_TEXT), nodo;
  while ((nodo = recorrido.nextNode())) {
    var el = nodo.parentElement, cs = getComputedStyle(el), tam = parseFloat(cs.fontSize);
    var estilo = cs.fontStyle === 'italic' ? 'italic ' : '';
    var alfa = el.closest('.sh-firma') ? 0.85 : 1;
    var enTitulo = !!el.closest('.sh-titulo');
    var ls = parseFloat(cs.letterSpacing) || 0, mayus = cs.textTransform === 'uppercase';
    c.font = estilo + tam + 'px ' + FUENTE;
    for (var i = 0; i < nodo.data.length; i++) {
      var ch = nodo.data[i];
      if (/\s/.test(ch)) continue;
      if (mayus) ch = ch.toUpperCase();
      rango.setStart(nodo, i); rango.setEnd(nodo, i + 1);
      var rs = rango.getClientRects(); if (!rs.length) continue;
      var b = rs[0], asc = c.measureText(ch).fontBoundingBoxAscent || tam * 0.8;
      glifos.push({ ch: ch, x: b.left + (b.width - ls) / 2, y: b.top + asc, tam: tam, estilo: estilo, alfa: alfa, espejo: enTitulo && ch === 'N' });   // la N de SHINE, espejada
    }
  }
  if (!carga || carga.length !== glifos.length) {
    carga = new Float32Array(glifos.length); visto = new Uint8Array(glifos.length); nVistos = 0;
  }
}

function armar() {
  var n = glifos.length;
  var capa = document.createElement('canvas'); capa.width = W * dpr; capa.height = H * dpr;
  var cx = capa.getContext('2d'); cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  function reducida(f) { var k = document.createElement('canvas'); k.width = Math.max(1, Math.round(W / f)); k.height = Math.max(1, Math.round(H / f)); return k; }
  var lejos = reducida(8), cerca = reducida(3), lx = lejos.getContext('2d'), nx = cerca.getContext('2d');
  lx.filter = 'blur(3px)'; nx.filter = 'blur(2px)';
  return function() {
    for (var i = 0; i < n; i++) {
      var g = glifos[i];
      if (completo) {
        carga[i] += (1 - carga[i]) * 0.04;               // todo el mensaje queda encendido
      } else {
        var R = Math.max(120, g.tam * 0.9);              // las letras grandes se cargan desde más lejos
        if (m.adentro) { var d = Math.hypot(g.x - m.x, g.y - g.tam * 0.35 - m.y); if (d < R) carga[i] = Math.min(1, carga[i] + (1 - d / R) * 0.12); }
        carga[i] *= 0.9975;
        if (!visto[i] && carga[i] > 0.55) { visto[i] = 1; nVistos++; }
      }
    }
    if (!completo) {
      if (nVistos > n * 0.06) raiz.classList.add('sh-sinpista');
      if (nVistos >= n * UMBRAL) completar();
    }
    cx.clearRect(0, 0, W, H); cx.textAlign = 'center'; cx.textBaseline = 'alphabetic';
    for (var k = 0; k < n; k++) {
      if (carga[k] < 0.01) continue;
      var gg = glifos[k], a = carga[k] * gg.alfa;
      cx.font = gg.estilo + gg.tam + 'px ' + FUENTE;
      cx.fillStyle = 'rgba(' + Math.round(170 + a * 50) + ',255,' + Math.round(150 + a * 40) + ',' + Math.min(1, a * 1.2) + ')';
      if (gg.espejo) { cx.save(); cx.translate(gg.x, gg.y); cx.scale(-1, 1); cx.fillText(gg.ch, 0, 0); cx.restore(); }
      else cx.fillText(gg.ch, gg.x, gg.y);
    }
    c.fillStyle = OSCURO; c.fillRect(0, 0, W, H);
    if (m.adentro && !completo) {
      var l = c.createRadialGradient(m.x, m.y, 0, m.x, m.y, 160);
      l.addColorStop(0, 'rgba(150,120,255,.18)'); l.addColorStop(1, 'rgba(150,120,255,0)');
      c.fillStyle = l; c.fillRect(m.x - 160, m.y - 160, 320, 320);
    }
    lx.clearRect(0, 0, lejos.width, lejos.height); lx.drawImage(capa, 0, 0, lejos.width, lejos.height);
    nx.clearRect(0, 0, cerca.width, cerca.height); nx.drawImage(capa, 0, 0, cerca.width, cerca.height);
    c.imageSmoothingEnabled = true;
    c.globalAlpha = 0.7; c.drawImage(lejos, 0, 0, W, H);
    c.globalAlpha = 0.9; c.drawImage(cerca, 0, 0, W, H);
    c.globalAlpha = 1; c.drawImage(capa, 0, 0, W, H);
  };
}

function bucle() { if (entrando && !cuadro) return; if (cuadro) cuadro(); requestAnimationFrame(bucle); }

var fuente = document.fonts && document.fonts.load ? document.fonts.load('40px "Adventor"', 'SHINE') : Promise.resolve();
var espera = new Promise(function(r) { setTimeout(r, 3000); });
Promise.race([fuente, espera]).catch(function() {}).then(function() {
  medir(); cuadro = armar();
  var t = null;
  window.addEventListener('resize', function() { clearTimeout(t); t = setTimeout(function() { medir(); cuadro = armar(); }, 150); });
  requestAnimationFrame(bucle);
});
}
if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar);
})();
