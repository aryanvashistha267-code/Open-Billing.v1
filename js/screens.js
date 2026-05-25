
const Screens={

dashboard(){
return `
<div class="header">
<div><b>OpenBilling</b></div>
<button onclick="app.theme()">🌓</button>
</div>

<div class="container">

<div class="card">
<h2>Dashboard</h2>

<div class="toolbar">
<button class="primary" onclick="app.go('billing')">Billing</button>
<button class="secondary" onclick="app.go('history')">History</button>
<button class="secondary" onclick="app.go('profile')">Profile</button>

<button class="secondary" onclick="document.getElementById('csv-file').click()">
Import CSV
</button>

<input 
type="file"
id="csv-file"
accept=".csv"
style="display:none"
onchange="app.importCSV(event)">

<button class="secondary" onclick="app.exportBackup()">
Backup
</button>

<button class="danger" onclick="localStorage.clear();location.reload()">
Clear Data
</button>

</div>

</div>

<div class="card">

<input 
placeholder="Search Products" autofocus
oninput="app.search(this.value)">

</div>

<div class="card">

<h3>Add Product</h3>

<div class="profile-grid">

<input id="pname" placeholder="Product Name">
<input id="pprice" type="number" placeholder="Price">
<input id="pstock" type="number" placeholder="Stock">

</div>

<div class="toolbar" style="margin-top:14px;">

<button class="primary" onclick="app.saveProduct()">
Add Product
</button>

</div>

</div>

<div class="card">

${state.products.map(p=>`

<div class="product">

<div>
<div><b>${p.name}</b></div>
<div>₹${p.price} • Stock ${p.stock}</div>
${p.stock <= 5 ? '<div class="low">Low Stock</div>' : ''}
</div>

<div class="toolbar">
<button class="secondary" onclick="app.editProduct('${p.id}')">
Edit
</button>

<button class="danger" onclick="app.deleteProduct('${p.id}')">
Delete
</button>
</div>

</div>

`).join('')}

</div>

</div>
`;
},

billing(){

const subtotal = state.bill.reduce((a,b)=>a+(b.price*b.qty),0);

const gstAmount = subtotal * ((parseFloat(state.gst)||0)/100);

const total = subtotal + gstAmount;

return `

<div class="header">
<div><b>Billing</b></div>
<button onclick="app.go('dashboard')">← Dashboard</button>
</div>

<div class="container">

<div class="billing-layout">

<div class="products-panel">

<input 
placeholder="Search Products" autofocus
oninput="app.searchBilling(this.value)">

<div id="billing-products" style="margin-top:14px;">

${state.products.map(p=>`

<div class="product">

<div>
<div><b>${p.name}</b></div>
<div>₹${p.price} • Stock ${p.stock}</div>
</div>

<button class="primary" onclick="app.addBill('${p.id}')">
Add
</button>

</div>

`).join('')}

</div>

</div>

<div class="summary-panel">

<h2>Summary</h2>

<input 
type="number"
placeholder="GST %"
value="${state.gst || 0}"
oninput="state.gst=this.value;app.render()">

<div style="margin-top:18px;">

${state.bill.map(i=>`

<div class="product">

<div>
<b>${i.name}</b><br>
₹${i.price} x ${i.qty}

<div class="toolbar" style="margin-top:8px;">
<button class="secondary" onclick="app.decreaseQty('${i.id}')">-</button>
<button class="secondary" onclick="app.increaseQty('${i.id}')">+</button>
</div>
</div>

<div>
₹${(i.price*i.qty).toFixed(2)}
</div>

</div>

`).join('')}

</div>

<div style="margin-top:18px;">
Subtotal ₹${subtotal.toFixed(2)}
</div>

<div style="margin-top:8px;">
GST ₹${gstAmount.toFixed(2)}
</div>

<h2>Total ₹${total.toFixed(2)}</h2>

<div class="toolbar">

<button class="danger" onclick="app.clearBill()">
Clear Bill
</button>

<button class="primary" onclick="app.completeBill()">
Generate Bill
</button>

<button class="secondary" onclick="app.go('history')">
History
</button>

</div>

</div>

</div>

</div>

<div class="float-history" onclick="app.go('history')">🧾</div>

`;
},

profile(){

return `

<div class="header">
<div><b>Profile</b></div>
<button onclick="app.go('dashboard')">← Dashboard</button>
</div>

<div class="container">

<div class="card">

<div class="profile-grid">

<input 
id="shop-name"
placeholder="Shop Name"
value="${state.profile.shopName || ''}">

<input 
id="shop-phone"
placeholder="Phone"
value="${state.profile.phone || ''}">

<textarea 
id="shop-address"
placeholder="Address">${state.profile.address || ''}</textarea>

<input 
id="shop-gstn"
placeholder="GSTN"
value="${state.profile.gstn || ''}">



<input 
id="accent"
type="color"
value="${state.profile.accent || '#1e40af'}">

</div>

<div class="toolbar" style="margin-top:14px;">

<button class="primary" onclick="app.saveProfile()">
Save Profile
</button>

</div>

</div>

</div>

`;

},

history(){

return `

<div class="header">
<div><b>Invoice History</b></div>
<button onclick="app.go('dashboard')">← Dashboard</button>
</div>

<div class="container">

<div class="card">

<input 
placeholder="Search Invoice"
oninput="app.searchHistory(this.value)">

</div>

<div id="history-list">

${state.history.map(h=>`

<div class="card">

<div class="product">

<div>
<div><b>${h.id}</b></div>
<div>${h.date}</div>
<div>Total ₹${h.total}</div>
</div>

<button class="primary" onclick="app.reprint('${h.id}')">
Print
</button>

</div>

</div>

`).join('')}

</div>

</div>

`;

}

};
