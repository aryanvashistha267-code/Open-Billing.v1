
const state={
screen:'dashboard',
products:JSON.parse(localStorage.getItem('products')||'[]'),
history:JSON.parse(localStorage.getItem('history')||'[]'),
profile:JSON.parse(localStorage.getItem('profile')||JSON.stringify({
shopName:'',
phone:'',
address:'',
gstn:'',

logo:'',
accent:'#1e40af'
})),
bill:[],
gst:0,
editId:null,
save(){
localStorage.setItem('products',JSON.stringify(this.products));
localStorage.setItem('history',JSON.stringify(this.history));
localStorage.setItem('profile',JSON.stringify(this.profile));
}
};
