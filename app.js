const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let shift = 3;

let animationMode = "classic";

let animationSpeed = 5;

let currentGenerator = null;



const plainText =
document.getElementById("plainText");

const cipherText =
document.getElementById("cipherText");

const encryptBtn =
document.getElementById("encryptBtn");

const decryptBtn =
document.getElementById("decryptBtn");

const shiftInput =
document.getElementById("shiftInput");

const stepBtn =
document.getElementById("stepBtn");


const modeSelect =
document.getElementById("modeSelect");

const speedSelect =
document.getElementById("speedSelect");

const startAppBtn =
document.getElementById("startAppBtn");

const setupModal =
document.getElementById("setupModal");


const innerRing =
document.getElementById("innerRing");



let outerLetters=[];
let innerLetters=[];



startAppBtn.onclick=()=>{

  animationMode=
  modeSelect.value;

  animationSpeed=
  speedSelect.value;

  setupModal.style.display="none";

};



function normalize(v){

  return ((v%26)+26)%26;

}



function sleep(ms){

  return new Promise(
    resolve=>setTimeout(resolve,ms)
  );

}



function rotateWheel(){

  shift++;

  shift=normalize(shift);

  updateWheel();

}



function updateWheel(){

  shiftInput.value=shift;

  const deg=
  shift*(360/26);

  innerRing.style.transform=
  `rotate(${deg}deg)`;

}



function clearHighlights(){

  [...outerLetters,...innerLetters]
  .forEach(
    l=>l.classList.remove(
      "highlightLetter"
    )
  );

}



function highlightPair(
  clearIndex,
  cipherIndex
){

  clearHighlights();

  outerLetters[
    clearIndex
  ].classList.add(
    "highlightLetter"
  );

  innerLetters[
    cipherIndex
  ].classList.add(
    "highlightLetter"
  );

}



async function animateEncrypt(){

  const text=
  plainText.value
  .toUpperCase();

  cipherText.value="";



  for(let i=0;i<text.length;i++){

    const char=text[i];

    if(
      !alphabet.includes(char)
    ){

      cipherText.value+=char;

      continue;

    }


    const clearIndex=
    alphabet.indexOf(char);

    const cipherIndex=
    normalize(
      clearIndex+shift
    );


    highlightPair(
      clearIndex,
      cipherIndex
    );


    cipherText.value+=
    alphabet[cipherIndex];


    if(
      animationMode==="plus"
    ){

      rotateWheel();

    }


    if(
      animationSpeed==="step"
    ){

      await waitForStep();

    }

    else{

      await sleep(
        1000/
        Number(
          animationSpeed
        )
      );

    }

  }

}



function waitForStep(){

  return new Promise(
    resolve=>{

      stepBtn.onclick=
      ()=>resolve();

    }
  );

}



encryptBtn.onclick=()=>{

  animateEncrypt();

};
