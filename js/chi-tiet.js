/* Script for product detail page
   - showTab(id): switch tab panels (exported globally for existing inline onclick)
   - handle add to cart: uses same localStorage structure as cart.js
*/
(function(){
  function getCart(){try{return JSON.parse(localStorage.getItem('cart')||'[]')}catch(e){return []}}
  function saveCart(c){localStorage.setItem('cart', JSON.stringify(c))}
  function updateCartCount(){const el=document.getElementById('cartCount'); if(!el) return; const cart=getCart(); const total=cart.reduce((s,i)=>s+Number(i.qty||0),0); el.textContent = total}
  function addItem(item){const cart=getCart(); const found=cart.find(i=>i.id===item.id); if(found){found.qty = Number(found.qty)+Number(item.qty)} else {cart.push(item)} saveCart(cart); updateCartCount();}

  window.showTab = function(id){
    var d = document.getElementById('desc');
    var det = document.getElementById('details');
    if(!d || !det) return;
    d.style.display = (id==='desc') ? '' : 'none';
    det.style.display = (id==='details') ? '' : 'none';
  };

  document.addEventListener('DOMContentLoaded', function(){
    // update counter
    updateCartCount();
    var btn = document.getElementById('addToCart');
    if(btn){
      btn.addEventListener('click', function(){
        var qEl = document.getElementById('qty'); var qty = 1; if(qEl) qty = Math.max(1, Number(qEl.value||1));
        // product info (keep in sync with page)
        var item = {id:'p1', name: 'Váy Vintage Linen', price: 1250000, qty: qty};
        addItem(item);
        // feedback
        var old = btn.textContent; btn.textContent = 'Đã thêm'; setTimeout(function(){btn.textContent = old},900);
      });
    }
  });
})();
function showMessage() {
    alert("JARVIS ONLINE. Chào mừng ngài Stark!");
}