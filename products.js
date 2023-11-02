const set = document.getElementById("set");
const form = document.querySelector(".form");

form.addEventListener('submit', e => {
  e.preventDefault();
  const dat = new FormData(form);
  const fot = Object.fromEntries(dat);
  fetch("https://starielogs.onrender.com/users", {
    'method': "post",
    'headers': {
      'Accept': "application/json",
      'Content-Type': "application/json"
    },
    'body': JSON.stringify(fot)
  }).then(res => {
    if (res.status === 201) {
      authmessage.style.display = 'flex';
      set.style.visibility = 'visible';
      
    }
  })["catch"](err => {
    set.innerText = "Error in Submission";
    console.log(err);
  });
});

const ords = document.querySelector('.order-box');
function seeCart() {
  if(ords.classList.contains("see")) {
    ords.classList.remove("see");
  } else {
    ords.classList.add("see");
  }
}

const boxes = document.querySelector(".products");
let proks = [];
const loader = document.querySelector("#loader");

function showLoader() {
  loader.classList.add('act');
}

function hideLoader() {
  if (loader.classList.contains('act')) {
    loader.classList.remove("act");
  }
}
boxes.classList.add('hide');

function showProduct(){
    showLoader();
    fetch("https://stariehair-api.onrender.com/prods")
    .then(response => response.json()) 
    .then(data => {

        hideLoader();
        boxes.classList.remove('hide');

        data.forEach((prode, index)=>{
            let container =
            `<div class="prod">
                <div class="prod-img" key="${index}">
                ${prode.isrc? `<img src="${prode.isrc}" alt="wig sales" loading="lazy">`:
                    `<video muted autoplay loop preload="auto">
                        <source src="${prode.vsrc}" type="video/mp4">
                    </video>`}
                    <button onclick="buy(this)">Add to Cart</button>
                    <input type="number" value="1" name="quantity"/> 
                </div>
                <div class="prod-info" key="${index}">
                    <h3>${prode.description}</h3>
                    <p>${prode.oldprice ? `<span id="old">&#8358;${prode.oldprice}</span>`: '<span id="old"></span>'} &#8358;${prode.newprice}</p>
                </div>
            </div> `
            boxes.innerHTML += container;
            proks.push(prode);
        });
    })["catch"](err => {
        console.log(err);
      });
}

// window.onload = showProduct;

const counter = document.getElementById('count');
const countera = document.getElementById('counta');
let a = 0;
const items = document.getElementById('items');
const tots = document.getElementById('total');
let total = 0;
const prod = [];
let curDate = new Date();



function buy(bee){
       const key = bee.parentNode;
       let aps = key.getAttribute('key');

       const berta = bee.parentNode.children[2].value;
        let best = parseInt(proks[aps].newprice) * parseInt(berta);

            let contain = `
                <div class="item">
                    <div class="item-g">
                        <h3>${proks[aps].description}</h3>
                        <p>Length: ${proks[aps].len? `<span>${proks[aps].len}</span>`: `<span></span>`}</p>
                    </div>
                    <h4 class="ape">${best}</h4>
                    <button onclick="deleteItem(this)">Remove Item</button>
                </div>
                `
            a++;
            countera.innerText = a;
            counter.innerText = a;

            items.innerHTML += contain;

            const quantity = {
                'description': `${proks[aps].description}`,
                'length':`${proks[aps].len}`,
                'price':`${best}`
            }
            prod.push(quantity);

            total = total + best;
            tots.innerText = total;
}

function deleteItem(e) {
    const ke = e.parentNode;
    ke.style.display = "none";
    const rad = ke.children[1].innerText;
    total = total - parseInt(rad);
    tots.innerText = total;
    a--;
    counter.innerText = a;
    countera.innerText = a;
  }

const payment = document.querySelector(".payment");
const checkout = document.getElementById("chckbtn");


  checkout.addEventListener('click', ()=>{
    showLoader();
    const rew = {
      'productname': prod,
      'totalprice': total,
      'numofgoods': a,
      'date': curDate
    };
    fetch("https://starielogs.onrender.com/products", {
      'method': "post",
      'headers': {
        'Accept': "application/json",
        'Content-Type': "application/json"
      },
      'body': JSON.stringify(rew)
    }).then(res => {
      if (res.status === 201) {
        hideLoader();
        payment.classList.add("active");
        ords.classList.remove("see");
      }
    })['catch'](err => {
      console.log(err);
    });
  });


function shutDo() {
    payment.classList.remove("active");
}

function beforeUnloadListener(event) {
  event.preventDefault();
  return event.returnValue = 'Are you sure you want to exit?';
};
// A function that invokes a callback when the page has unsaved changes.
function onPageHasUnsavedChanges(){
  window.addEventListener('beforeunload', beforeUnloadListener);
};

onPageHasUnsavedChanges();
// A function that invokes a callback when the page's unsaved changes are resolved.
function onAllChangesSaved(){
  window.removeEventListener('beforeunload', beforeUnloadListener);
};

onAllChangesSaved();



