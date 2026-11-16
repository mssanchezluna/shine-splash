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
var FUENTE = '"Questrial", "ITC Avant Garde Gothic", "Avant Garde", "URW Gothic", "Century Gothic", Futura, sans-serif';
var ANCHO = 0.86, ALTO_TITULO = 0.5;    // SHINE: hasta el 86 % del ancho y el 50 % del alto de la pantalla
var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

var tapa = document.createElement('style');
tapa.textContent = 'html{background:' + OSCURO + '}body{visibility:hidden}';
document.head.appendChild(tapa);
function iniciar() {
tapa.textContent = '';

var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Questrial&display=swap';
document.head.appendChild(link);

var st = document.createElement('style');
st.textContent =
  '#shine-lab{position:fixed;inset:0;z-index:2147483000;background:' + OSCURO + ';overflow:hidden;cursor:crosshair;touch-action:none;transition:opacity .8s ease}' +
  '#shine-lab.sh-saliendo{opacity:0;pointer-events:none}' +
  '#shine-lab.sh-completo{cursor:pointer}' +
  '#shine-lab .sh-texto{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);' +
  'color:#210e0e;font-family:' + FUENTE + ';font-weight:normal;text-transform:uppercase;' +
  'line-height:1;visibility:hidden;-webkit-user-select:none;user-select:none}' +
  '#shine-lab .sh-texto > div{display:block;width:max-content;white-space:nowrap}' +
  '#shine-lab .sh-titulo{letter-spacing:.02em}' +
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
    var ls = parseFloat(cs.letterSpacing) || 0, mayus = cs.textTransform === 'uppercase';
    c.font = estilo + tam + 'px ' + FUENTE;
    for (var i = 0; i < nodo.data.length; i++) {
      var ch = nodo.data[i];
      if (/\s/.test(ch)) continue;
      if (mayus) ch = ch.toUpperCase();
      rango.setStart(nodo, i); rango.setEnd(nodo, i + 1);
      var rs = rango.getClientRects(); if (!rs.length) continue;
      var b = rs[0], asc = c.measureText(ch).fontBoundingBoxAscent || tam * 0.8;
      glifos.push({ ch: ch, x: b.left + (b.width - ls) / 2, y: b.top + asc, tam: tam, estilo: estilo, alfa: alfa });
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
      cx.fillText(gg.ch, gg.x, gg.y);
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

var fuente = document.fonts && document.fonts.load ? document.fonts.load('40px "Questrial"') : Promise.resolve();
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
