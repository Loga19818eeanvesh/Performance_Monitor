import io from 'socket.io-client';
let socket = io('http://localhost:2828');
socket.emit('clientAuth','uihjt3refvdsadf')

export default socket;