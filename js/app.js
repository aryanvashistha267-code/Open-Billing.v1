
const app={

init(){
},


startApp(){

const splash=document.getElementById('splash');

if(splash){
splash.style.display='none';
}

this.render();

},

go(s){
state.screen=s;
this.render();
},

render(){
document.getElementById('app').innerHTML=Screens[state.screen]();
},


saveProfile(){

state.profile.shopName=document.getElementById('shop-name').value;
state.profile.phone=document.getElementById('shop-phone').value;
state.profile.address=document.getElementById('shop-address').value;
state.profile.gstn=document.getElementById('shop-gstn').value;

state.profile.accent=document.getElementById('accent').value;

document.documentElement.style.setProperty(
'--primary',
state.profile.accent
);

state.save();

alert('Profile Saved');

},



theme(){
document.body.classList.toggle('dark');
},

saveProduct(){

const name = document.getElementById('pname').value.trim();
const price = parseFloat(document.getElementById('pprice').value||0);
const stock = parseInt(document.getElementById('pstock').value||0);

if(state.products.some(p=>p.name.toLowerCase()===name.toLowerCase() && p.id!==state.editId)){
alert('Duplicate Product');
return;
}

if(state.editId){

const p = state.products.find(x=>x.id===state.editId);

p.name=name;
p.price=price;
p.stock=stock;

state.editId=null;

}else{

state.products.push({
id:Date.now().toString(),
name,
price,
stock
});

}

state.save();
this.render();
},

editProduct(id){

const p = state.products.find(x=>x.id===id);

document.getElementById('pname').value=p.name;
document.getElementById('pprice').value=p.price;
document.getElementById('pstock').value=p.stock;

state.editId=id;

},

deleteProduct(id){
state.products=state.products.filter(x=>x.id!==id);
state.save();
this.render();
},

search(q){
q=q.toLowerCase();

document.querySelectorAll('.product').forEach(p=>{
p.style.display=p.innerText.toLowerCase().includes(q)?'flex':'none';
});
},

searchBilling(q){
q=q.toLowerCase();

document.querySelectorAll('#billing-products .product').forEach(p=>{
p.style.display=p.innerText.toLowerCase().includes(q)?'flex':'none';
});
},

searchHistory(q){
q=q.toLowerCase();

document.querySelectorAll('#history-list .product').forEach(p=>{
p.style.display=p.innerText.toLowerCase().includes(q)?'flex':'none';
});
},

addBill(id){

const p = state.products.find(x=>x.id===id);

if(!p || p.stock<=0){
alert('Out of stock');
return;
}

const existing = state.bill.find(x=>x.id===id);

if(existing){
existing.qty++;
}else{
state.bill.push({...p,qty:1});
}

this.render();
},



clearBill(){

state.bill=[];

this.render();

},

increaseQty(id){

const item=state.bill.find(x=>x.id===id);

if(item){
item.qty++;
}

this.render();

},

decreaseQty(id){

const item=state.bill.find(x=>x.id===id);

if(item){

item.qty--;

if(item.qty<=0){
state.bill=state.bill.filter(x=>x.id!==id);
}

}

this.render();

},


completeBill(){

state.bill.forEach(i=>{
const p = state.products.find(x=>x.id===i.id);
if(p){
p.stock=Math.max(0,p.stock-i.qty);
}
});

const subtotal = state.bill.reduce((a,b)=>a+(b.price*b.qty),0);
const gst = subtotal * ((parseFloat(state.gst)||0)/100);
const total = subtotal + gst;

const invoice={
id:'INV-'+Date.now(),
date:new Date().toLocaleString(),
items:state.bill,
total:total.toFixed(2)
};

state.history.unshift(invoice);

state.save();

const html=`<div class="invoice-print">

<div style="text-align:center;margin-bottom:18px;">

<h2>${state.profile.shopName || 'OpenBilling'}</h2>

<div>${state.profile.address || ''}</div>

<div>${state.profile.phone || ''}</div>

<div>GSTN: ${state.profile.gstn || '-'}</div>

</div>

<hr>

<h3>Invoice</h3>

<table style="width:100%;border-collapse:collapse;margin-top:12px;">

<tr>
<th align="left">Item</th>
<th align="left">Qty</th>
<th align="left">Rate</th>
<th align="right">Total</th>
</tr>

${invoice.items.map(i=>`
<tr>
<td>${i.name}</td>
<td>${i.qty}</td>
<td>₹${i.price}</td>
<td align="right">₹${i.price*i.qty}</td>
</tr>
`).join('')}

</table>

<hr>

<div style="text-align:right;">
<h2>Total ₹${invoice.total}</h2>
</div>

<div style="text-align:center;margin-top:20px;">

<div>${state.profile.upi || ''}</div>
</div>

<h2>OpenBilling</h2><div style='font-size:12px;margin-bottom:8px;'>Fast Universal Billing App</div>
<hr>
${invoice.items.map(i=>`<div>${i.name} x ${i.qty} - ₹${i.price*i.qty}</div>`).join('')}
<hr>
<h3>Total ₹${invoice.total}</h3>
</div>`;

const w=window.open('');
w.document.write(html);
w.print();

state.bill=[];
this.go('history');

},

reprint(id){

const inv = state.history.find(x=>x.id===id);

if(!inv) return;

const html=`<div class="invoice-print">

<div style="text-align:center;margin-bottom:18px;">

<h2>${state.profile.shopName || 'OpenBilling'}</h2>

<div>${state.profile.address || ''}</div>

<div>${state.profile.phone || ''}</div>

<div>GSTN: ${state.profile.gstn || '-'}</div>

</div>

<hr>

<h3>Invoice</h3>

<table style="width:100%;border-collapse:collapse;margin-top:12px;">

<tr>
<th align="left">Item</th>
<th align="left">Qty</th>
<th align="left">Rate</th>
<th align="right">Total</th>
</tr>

${invoice.items.map(i=>`
<tr>
<td>${i.name}</td>
<td>${i.qty}</td>
<td>₹${i.price}</td>
<td align="right">₹${i.price*i.qty}</td>
</tr>
`).join('')}

</table>

<hr>

<div style="text-align:right;">
<h2>Total ₹${invoice.total}</h2>
</div>

<div style="text-align:center;margin-top:20px;">

<div>${state.profile.upi || ''}</div>
</div>

<h2>OpenBilling</h2><div style='font-size:12px;margin-bottom:8px;'>Fast Universal Billing App</div>
<hr>
${inv.items.map(i=>`<div>${i.name} x ${i.qty} - ₹${i.price*i.qty}</div>`).join('')}
<hr>
<h3>Total ₹${inv.total}</h3>
</div>`;

const w=window.open('');
w.document.write(html);
w.print();

},

downloadPDF(){
window.print();
},


importCSV(event){

const file = event.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = e => {

const lines = e.target.result.split('\n');

for(let i=1;i<lines.length;i++){

const row = lines[i].trim();

if(!row) continue;

const [name, price, stock] = row.split(',');

const cleanName = (name || '').trim();

if(!cleanName) continue;

if(state.products.some(p=>p.name.toLowerCase()===cleanName.toLowerCase())){
continue;
}

state.products.push({
id: Date.now().toString() + i,
name: cleanName,
price: parseFloat(price || 0),
stock: parseInt(stock || 0)
});

}

state.save();

alert('CSV Imported');

this.render();

};

reader.readAsText(file);

},

exportBackup(){

const blob = new Blob(
[JSON.stringify({
products:state.products,
history:state.history,
profile:state.profile
},null,2)],
{type:'application/json'}
);

const a=document.createElement('a');
a.href=URL.createObjectURL(blob);
a.download='openbilling-backup.json';
a.click();

},

restore(event){

const file=event.target.files[0];
if(!file) return;

const reader=new FileReader();

reader.onload=e=>{

const data=JSON.parse(e.target.result);

state.products=data.products||[];
state.history=data.history||[];
state.profile=data.profile||{};

state.save();

location.reload();

};

reader.readAsText(file);

}

};

window.onload=()=>app.init();
