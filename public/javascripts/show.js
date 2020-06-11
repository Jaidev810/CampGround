const h1 = document.querySelector('#h1');
const h2 = document.querySelector('#h2');
const h3 = document.querySelector('#h3');
const h4 = document.querySelector('#h4');


document.querySelector('#home').addEventListener('click', ()=>{
    visibility(h1, h2, h3, h4);
});

document.querySelector('#price').addEventListener('click', ()=>{
    visibility(h2, h1, h3, h4);
});

document.querySelector('#desc').addEventListener('click', ()=>{
    visibility(h3, h2, h1, h4);
});

document.querySelector('#review').addEventListener('click', ()=>{
    visibility(h4, h2, h3, h1);
});


function visibility(active, inactive1, inactive2, inactive3){
    active.style.display = 'flex';
    inactive1.style.display = 'none';
    inactive2.style.display = 'none';
    inactive3.style.display = 'none';
}
