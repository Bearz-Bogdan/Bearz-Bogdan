 //Functie pentru a rotunji la 2 zecimale preturile
 export const addDecimals = num => (Math.round(num * 100) / 100).toFixed(2);

 export const updateCart = (state) => {
  //Calcul pentru pretul produselor
  state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));

  //Calcul pentru pretul livrarii (daca este mai mare de 100 lei, atunci livrarea este gratuita, daca nu, atunci se adauga 10 lei)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  //Calcul pentru pretul taxelor (15% din pretul produselor)
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

  //Calcul pentru pretul total
  state.totalPrice = (Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)).toFixed(2);

  //Salvare in localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
 }