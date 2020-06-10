const button = document.querySelector('#check');

const tl = new TimelineLite({ paused: true, reversed: true});

tl.fromTo('#backimg1', 0.5, {
    width: '100%',
    heigth: '100%',
    ease: Power2.easeout

}, {
    width: '0%',
    heigth: '0%',
    ease: Power2.easeout
})

tl.fromTo('#backimg2', 0.5, {
    width: '0%',
    heigth: '0%',
    ease: Power2.easeout
}, {
    width: '100%',
    heigth: '100%',
    ease: Power2.easeout
})


button.addEventListener('click', () =>{

    if(tl.isActive()){
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
    }
    toggleTween(tl);

})

function toggleTween(tween){
    tween.reversed() ? tween.play() : tween.reverse();
    //if             then            else  
}

