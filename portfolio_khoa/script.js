// typing
const W=["Sinh viên IT","Web Developer","Python & Java learner","Luôn học hỏi"];let wi=0,ci=0,del=0;const ty=document.getElementById('ty');
(function t(){const w=W[wi];ty.textContent='> '+w.slice(0,ci);if(!del&&ci++==w.length){del=1;return setTimeout(t,1400)}if(del&&--ci<0){del=0;ci=0;wi=(wi+1)%W.length}setTimeout(t,del?40:90)})();
// reveal, skills, counters
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');e.target.querySelectorAll('.sk').forEach(s=>s.classList.add('in'));
e.target.querySelectorAll('[data-n]').forEach(b=>{if(b.dn)return;b.dn=1;const n=+b.dataset.n;let i=0;const s=setInterval(()=>{b.textContent=++i;if(i>=n)clearInterval(s)},1200/n)});io.unobserve(e.target)}),{threshold:.15});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));
// progress + active link
const links=[...document.querySelectorAll('nav li a')];
addEventListener('scroll',()=>{const h=document.documentElement;document.getElementById('bar').style.width=scrollY/(h.scrollHeight-innerHeight)*100+'%';
let cur='home';document.querySelectorAll('section').forEach(s=>{if(scrollY>=s.offsetTop-160)cur=s.id});links.forEach(a=>a.classList.toggle('on',a.hash=='#'+cur))});
// glow + tilt
const g=document.getElementById('glow');addEventListener('pointermove',e=>{g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});
document.querySelectorAll('.card').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(700px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
// particles
const cv=document.getElementById('cv'),x=cv.getContext('2d');let P=[];function rs(){cv.width=innerWidth;cv.height=innerHeight;P=Array.from({length:Math.min(70,innerWidth/18|0)},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))}rs();addEventListener('resize',rs);
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)(function d(){x.clearRect(0,0,cv.width,cv.height);P.forEach((p,i)=>{p.x=(p.x+p.vx+cv.width)%cv.width;p.y=(p.y+p.vy+cv.height)%cv.height;x.fillStyle='rgba(34,211,238,.7)';x.fillRect(p.x,p.y,2,2);for(let j=i+1;j<P.length;j++){const q=P[j],dd=Math.hypot(p.x-q.x,p.y-q.y);if(dd<120){x.strokeStyle=`rgba(139,109,255,${.25*(1-dd/120)})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}});requestAnimationFrame(d)})();
// theme + form
document.getElementById('tg').onclick=()=>{const r=document.documentElement,d=matchMedia('(prefers-color-scheme:dark)').matches;const cur=r.dataset.theme||(d?'dark':'light');r.dataset.theme=cur=='dark'?'light':'dark'};
document.getElementById('f').onsubmit=e=>{e.preventDefault();location.href='mailto:khoadd4552@ut.edu.vn?subject='+encodeURIComponent('Liên hệ từ portfolio - '+n.value)+'&body='+encodeURIComponent(m.value)};
