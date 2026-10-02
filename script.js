const dialog=document.querySelector('#photo-dialog');
const expanded=document.querySelector('#expanded-photo');
const caption=document.querySelector('#photo-caption');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{
  expanded.src=button.dataset.image;
  expanded.alt=button.querySelector('img').alt;
  caption.textContent=button.dataset.caption;
  dialog.showModal();
  document.body.style.overflow='hidden';
}));
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';});

// Automatic hero gallery with pause controls and reduced-motion support.
const hero = document.querySelector('.hero-photo');
const slides = [
  ['assets/residencia.webp', 'Residência de dois pavimentos com fachada clara, jardim e piscina'],
  ['assets/fachada.webp', 'Fachada com revestimento de madeira e área externa em obras'],
  ['assets/deck.webp', 'Deck de madeira construído ao redor de uma árvore'],
  ['assets/estrutura.webp', 'Estrutura em execução com vista para o mar']
];
const firstSlide = hero.querySelector('img');
firstSlide.classList.add('hero-slide', 'active');
const images = [firstSlide, ...slides.slice(1).map(([src, alt]) => {
  const image = new Image();
  image.src = src; image.alt = alt; image.className = 'hero-slide';
  image.setAttribute('aria-hidden', 'true');
  hero.insertBefore(image, hero.firstChild);
  return image;
})];
hero.setAttribute('role', 'region');
hero.setAttribute('aria-label', 'Fotos de obras da Mota Beltrame');
hero.setAttribute('aria-roledescription', 'carrossel');
const controls = document.createElement('div');
controls.className = 'hero-controls';
let currentSlide = 0, timer;
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = motionPreference.matches;
const dots = slides.map((slide, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `Mostrar foto ${index + 1}: ${slide[1]}`);
  button.setAttribute('aria-pressed', String(index === 0));
  button.className = 'slide-dot';
  button.addEventListener('click', () => { showSlide(index); restart(); });
  controls.append(button);
  return button;
});
const pauseButton = document.createElement('button');
pauseButton.type = 'button';
pauseButton.className = 'slide-pause';
controls.append(pauseButton);
hero.append(controls);
function showSlide(index) {
  currentSlide = index;
  images.forEach((image, i) => {
    image.classList.toggle('active', i === index);
    image.setAttribute('aria-hidden', String(i !== index));
    dots[i].setAttribute('aria-pressed', String(i === index));
  });
}
function restart() {
  clearInterval(timer);
  pauseButton.textContent = paused ? 'Reproduzir' : 'Pausar';
  pauseButton.setAttribute('aria-label', paused ? 'Reproduzir apresentação de fotos' : 'Pausar apresentação de fotos');
  if (!paused && !document.hidden && !hero.matches(':hover') && !hero.contains(document.activeElement)) {
    timer = setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);
  }
}
pauseButton.addEventListener('click', () => { paused = !paused; restart(); });
hero.addEventListener('mouseenter', () => clearInterval(timer));
hero.addEventListener('mouseleave', restart);
hero.addEventListener('focusin', () => clearInterval(timer));
hero.addEventListener('focusout', () => setTimeout(restart, 0));
document.addEventListener('visibilitychange', restart);
motionPreference.addEventListener('change', event => { paused = event.matches; restart(); });
restart();
