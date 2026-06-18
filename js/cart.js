/* Simple cart using localStorage
   - stores array of items: {id,name,price,qty}
   - exposes add-to-cart via buttons with class .add-btn and data attributes
*/
(function(){
  function getCart(){try{return JSON.parse(localStorage.getItem('cart')||'[]')}catch(e){return []}}
  function saveCart(c){localStorage.setItem('cart', JSON.stringify(c))}
  function updateCartCount(){const el=document.getElementById('cartCount'); if(!el) return; const cart=getCart(); const total=cart.reduce((s,i)=>s+Number(i.qty||0),0); el.textContent = total}

  function addToCart(item){const cart=getCart(); const found = cart.find(i=>i.id===item.id); if(found){found.qty = Number(found.qty) + Number(item.qty)} else {cart.push(item)} saveCart(cart); updateCartCount()}

  document.addEventListener('click', function(e){
    const btn = e.target.closest && e.target.closest('.add-btn');
    if(!btn) return;
    const id = btn.dataset.id; const name = btn.dataset.name; const price = Number(btn.dataset.price||0);
    // find qty in same card
    const card = btn.closest('.card');
    let qty = 1;
    if(card){const q = card.querySelector('input.qty'); if(q) qty = Math.max(1, Number(q.value||1))}
    addToCart({id,name,price,qty});
    // small feedback
    try{btn.textContent = 'Đã thêm'; setTimeout(()=>btn.textContent='Thêm vào giỏ',900)}catch(e){}
  })

  // init
  document.addEventListener('DOMContentLoaded', updateCartCount);
})();
