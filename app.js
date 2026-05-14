const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const plainText=document.getElementById("plainText");
const cipherText=document.getElementById("cipherText");

const encryptBtn=document.getElementById("encryptBtn");
const decryptBtn=document.getElementById("decryptBtn");

const shiftInput=document.getElementById("shiftInput");

const wheel=document.getElementById("wheel");
const outerRing=document.getElementById("outerRing");
const innerRing=document.getElementById("innerRing");

const speedRange=document.getElementById("speedRange");
const speedValue=document.getElementById("speedValue");

const stepMode=document.getElementById("stepMode");
const stepBtn=document.getElementById("stepBtn");

const modeSelect=document.getElementById("modeSelect");
const startAppBtn=document.getElementById("startAppBtn");
const setupModal=document.getElementById("setupModal");


let shift=3;
let startShift=3;

let appMode="classic";

let outerLetters=[];
let innerLetters=[];

let dragging=false;

let waitingResolver=null;

let isAnimating=false;



startAppBtn.onclick=()=>{

  appMode=
  modeSelect.value;

  setupModal.style.display=
  "none";

};




function normalize(v){

  return ((v%26)+26)%26;

}



function sleep(ms){

  return new Promise(
    resolve=>setTimeout(
      resolve,
      ms
    )
  );

}



function speedDelay(){

  return 1000/
  Number(
    speedRange.value
  );

}



function clearHighlights(){

  outerLetters.forEach(
    l=>l.classList.remove(
      "clearHighlight"
    )
  );

  innerLetters.forEach(
    l=>l.classList.remove(
      "cipherHighlight"
    )
  );

}



function highlight(
  clearIndex,
  cipherIndex
){

  clearHighlights();

  outerLetters[
    clearIndex
  ].classList.add(
    "clearHighlight"
  );

  innerLetters[
    cipherIndex
  ].classList.add(
    "cipherHighlight"
  );

}



function waitUser(){

  return new Promise(
    resolve=>{

      waitingResolver=
      resolve;

      stepBtn.disabled=
      false;

    }
  );

}



async function waitAnimation(){

  if(
    stepMode.checked
  ){

    await waitUser();

    return;
  }

  await sleep(
    speedDelay()
  );

}



stepBtn.onclick=()=>{

  if(
    waitingResolver
  ){

    const r=
    waitingResolver;

    waitingResolver=
    null;

    stepBtn.disabled=
    true;

    r();

  }

};



function updateWheel(){

  shift=
  normalize(shift);

  shiftInput.value=
  shift;

  const deg=
  shift*(360/26);

  innerRing.style.transform=
  `rotate(${-deg}deg)`;

}



function rotateOneStep(){

  shift++;

  shift=
  normalize(
    shift
  );

  updateWheel();

}



function caesar(
  char,
  amount
){

  const index=
  alphabet.indexOf(
    char.toUpperCase()
  );

  const target=
  normalize(
    index+amount
  );

  return alphabet[
    target
  ];

}



async function animateEncrypt(){

  if(
    isAnimating
  ) return;

  isAnimating=true;

  shift=
  startShift;

  updateWheel();

  cipherText.value="";

  const text=
  plainText.value
  .toUpperCase();


  for(
    let i=0;
    i<text.length;
    i++
  ){

    const char=
    text[i];

    if(
      !alphabet.includes(
        char
      )
    ){

      cipherText.value+=
      char;

      continue;

    }


    const clearIndex=
    alphabet.indexOf(
      char
    );

    const cipherIndex=
    normalize(
      clearIndex+
      shift
    );


    highlight(
      clearIndex,
      cipherIndex
    );


    cipherText.value+=
    caesar(
      char,
      shift
    );


    await waitAnimation();


    if(
      appMode==="plus"
    ){

      rotateOneStep();

      await sleep(
        250
      );

    }

  }


  clearHighlights();

  isAnimating=false;

}



async function animateDecrypt(){

  if(
    isAnimating
  ) return;

  isAnimating=true;

  shift=
  startShift;

  updateWheel();

  plainText.value="";

  const text=
  cipherText.value
  .toUpperCase();



  for(
    let i=0;
    i<text.length;
    i++
  ){

    const char=
    text[i];

    if(
      !alphabet.includes(
        char
      )
    ){

      plainText.value+=
      char;

      continue;

    }


    const cipherIndex=
    alphabet.indexOf(
      char
    );

    const clearIndex=
    normalize(
      cipherIndex-
      shift
    );


    highlight(
      clearIndex,
      cipherIndex
    );


    plainText.value+=
    caesar(
      char,
      -shift
    );


    await waitAnimation();


    if(
      appMode==="plus"
    ){

      rotateOneStep();

      await sleep(
        250
      );

    }

  }


  clearHighlights();

  isAnimating=false;

}



encryptBtn.onclick=
animateEncrypt;

decryptBtn.onclick=
animateDecrypt;



speedRange.oninput=
()=>{

  speedValue.textContent=
  speedRange.value+
  " Zeichen/Sek.";

};



shiftInput.oninput=
()=>{

  shift=
  Number(
    shiftInput.value
  );

  startShift=
  shift;

  updateWheel();

};



speedValue.textContent=
speedRange.value+
" Zeichen/Sek.";
