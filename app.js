const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const plainText = document.getElementById("plainText");
const cipherText = document.getElementById("cipherText");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");

const shiftInput = document.getElementById("shiftInput");

const wheel = document.getElementById("wheel");
const outerRing = document.getElementById("outerRing");
const innerRing = document.getElementById("innerRing");

const speedRange = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");

const stepMode = document.getElementById("stepMode");
const stepBtn = document.getElementById("stepBtn");

const modeSelect = document.getElementById("modeSelect");
const startAppBtn = document.getElementById("startAppBtn");
const setupModal = document.getElementById("setupModal");


let shift = 3;
let startShift = 3;

let appMode = "classic";

let dragging = false;

let isAnimating = false;

let stepResolver = null;

let outerLetters = [];
let innerLetters = [];



/* ===================================== */

function normalizeShift(v){

  return ((v % 26)+26)%26;

}



/* ===================================== */

function polarPosition(
  size,
  radius,
  angleDeg
){

  const rad =
  angleDeg *
  Math.PI /
  180;

  return {

    x:
    size/2 +
    Math.sin(rad) *
    radius,

    y:
    size/2 -
    Math.cos(rad) *
    radius

  };

}



/* ===================================== */

function createLetter(
  parent,
  char,
  className,
  radius,
  angle,
  size
){

  const pos =
  polarPosition(
    size,
    radius,
    angle
  );


  const letter =
  document.createElement(
    "div"
  );


  letter.className =
  `letter ${className}`;


  letter.textContent =
  char;


  letter.style.left =
  `${pos.x}px`;

  letter.style.top =
  `${pos.y}px`;


  letter.style.transform =
  `translate(-50%,-50%)
   rotate(${angle}deg)`;


  parent.appendChild(
    letter
  );


  return letter;

}



/* ===================================== */

function createDivider(
  parent,
  r1,
  r2,
  angle,
  size
){

  const radius =
  (r1+r2)/2;

  const length =
  r2-r1;


  const pos =
  polarPosition(
    size,
    radius,
    angle
  );


  const divider =
  document.createElement(
    "div"
  );


  divider.className =
  "dividerSegment";


  divider.style.height =
  `${length}px`;

  divider.style.left =
  `${pos.x}px`;

  divider.style.top =
  `${pos.y}px`;


  divider.style.transform =
  `translate(-50%,-50%)
   rotate(${angle}deg)`;


  parent.appendChild(
    divider
  );

}



/* ===================================== */

function createRingBorder(
  parent,
  radius
){

  const border =
  document.createElement(
    "div"
  );


  border.className =
  "ringBorder";


  border.style.width =
  `${radius*2}px`;


  border.style.height =
  `${radius*2}px`;


  parent.appendChild(
    border
  );

}



/* ===================================== */

function createWheel(){

  outerRing.innerHTML = "";
  innerRing.innerHTML = "";

  outerLetters = [];
  innerLetters = [];


  const size =
  wheel
  .getBoundingClientRect()
  .width;


  const step =
  360/26;


  const outerOuter =
  size*0.50;

  const outerInner =
  size*0.40;

  const outerLettersRadius =
  size*0.455;


  const innerOuter =
  size*0.395;

  const innerInner =
  size*0.25;

  const innerLettersRadius =
  size*0.325;



  createRingBorder(
    outerRing,
    outerOuter
  );

  createRingBorder(
    outerRing,
    outerInner
  );


  createRingBorder(
    innerRing,
    innerOuter
  );

  createRingBorder(
    innerRing,
    innerInner
  );



  for(
    let i=0;
    i<26;
    i++
  ){

    const angle =
    i*step;


    createDivider(
      outerRing,
      outerInner,
      outerOuter,
      angle-step/2,
      size
    );


    createDivider(
      innerRing,
      innerInner,
      innerOuter,
      angle-step/2,
      size
    );



    outerLetters.push(

      createLetter(
        outerRing,
        alphabet[i],
        "outerLetter",
        outerLettersRadius,
        angle,
        size
      )

    );



    innerLetters.push(

      createLetter(
        innerRing,
        alphabet[i],
        "innerLetter",
        innerLettersRadius,
        angle,
        size
      )

    );

  }

}



/* ===================================== */

function updateWheel(){

  shift =
  normalizeShift(
    shift
  );


  shiftInput.value =
  shift;


  const deg =
  shift *
  (360/26);


  innerRing.style.transform =
  `rotate(${-deg}deg)`;

}



/* ===================================== */

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



/* ===================================== */

function highlightPair(
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



/* ===================================== */

function waitDelay(){

  if(
    stepMode.checked
  ){

    return new Promise(
      resolve=>{

        stepResolver =
        resolve;

        stepBtn.disabled =
        false;

      }
    );

  }


  stepBtn.disabled =
  true;


  return new Promise(
    resolve=>setTimeout(
      resolve,
      1000/
      Number(
        speedRange.value
      )
    )
  );

}



/* ===================================== */

stepBtn.onclick = ()=>{

  if(
    stepResolver
  ){

    const r =
    stepResolver;

    stepResolver =
    null;

    stepBtn.disabled =
    true;

    r();

  }

};



/* ===================================== */

function rotateOneStep(){

  shift++;

  shift =
  normalizeShift(
    shift
  );


  updateWheel();

}



/* ===================================== */

function caesarChar(
  char,
  amount
){

  const index =
  alphabet.indexOf(
    char
  );


  return alphabet[

    normalizeShift(
      index+
      amount
    )

  ];

}



/* ===================================== */

async function process(
  encrypt=true
){

  if(
    isAnimating
  ) return;


  isAnimating =
  true;


  shift =
  startShift;


  updateWheel();


  clearHighlights();


  const input =

  encrypt ?

  plainText.value
  .toUpperCase()

  :

  cipherText.value
  .toUpperCase();



  const outputField =

  encrypt ?

  cipherText

  :

  plainText;


  outputField.value =
  "";



  for(
    let i=0;
    i<input.length;
    i++
  ){

    const char =
    input[i];


    if(
      !alphabet.includes(
        char
      )
    ){

      outputField.value +=
      char;

      continue;

    }



    let clearIndex;
    let cipherIndex;



    if(
      encrypt
    ){

      clearIndex =
      alphabet.indexOf(
        char
      );


      cipherIndex =
      normalizeShift(
        clearIndex+
        shift
      );

    }

    else{

      cipherIndex =
      alphabet.indexOf(
        char
      );


      clearIndex =
      normalizeShift(
        cipherIndex-
        shift
      );

    }



    highlightPair(
      clearIndex,
      cipherIndex
    );



    outputField.value +=

    encrypt ?

    caesarChar(
      char,
      shift
    )

    :

    caesarChar(
      char,
      -shift
    );



    await waitDelay();



    if(
      appMode==="plus"
    ){

      rotateOneStep();

      await new Promise(
        resolve=>setTimeout(
          resolve,
          250
        )
      );

    }

  }



  clearHighlights();

  isAnimating =
  false;

}



/* ===================================== */

encryptBtn.onclick =
()=>process(true);

decryptBtn.onclick =
()=>process(false);



speedRange.oninput =
()=>{

  speedValue.textContent =

  speedRange.value+
  " Zeichen/Sek.";

};



shiftInput.oninput =
()=>{

  shift =
  Number(
    shiftInput.value
  );


  startShift =
  shift;


  updateWheel();

};



startAppBtn.onclick =
()=>{

  appMode =
  modeSelect.value;


  setupModal.style.display =
  "none";

};



window.addEventListener(
  "resize",
  ()=>{

    createWheel();

    updateWheel();

  }
);



createWheel();

updateWheel();

speedValue.textContent =

speedRange.value+
" Zeichen/Sek.";
