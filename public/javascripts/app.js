const btn1 = document.querySelector('#btn1');
const btn2 = document.querySelector('#btn2');
const btn3 = document.querySelector('#btn3');

const tl1 = new TimelineLite({ paused: true, reversed: true});

tl.fromTo('#backimg1', 0.5, {
    width: '0%',
    heigth: '0%', 
    ease: Power2.easeout
}, {
    width: '100%',
    heigth: '100%',
    ease: Power2.easeout
})