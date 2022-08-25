const leftWalls = document.querySelector(".leftWalls");
const rightWalls = document.querySelector(".rightWalls");
const rightSide = document.querySelector(".rightSide");
const liftShaft = document.querySelector(".liftShaft");
const lift = document.querySelector(".forLift");
let liftPosition = +lift.style.bottom.substr(0, lift.style.bottom.length - 2);

let change = 0;
let buttonImg;
let buttonDiv;
let eachFloor = lift.clientHeight;
floorsCount = liftShaft.clientHeight / eachFloor;

let queue = [];

for (let i = 10; i >= 1; i--) {
  // left side
  let leftFloors = document.createElement("div");
  leftFloors.setAttribute("class", "leftFloors");
  let leftWallsImg = document.createElement("img");
  leftWallsImg.setAttribute("class", "leftWallsImg");
  leftWallsImg.src = "./imgs/wall-brick-arrow-black-wallpaper-preview.jpg";

  let leftFloorsNumbers = document.createElement("div");
  leftFloorsNumbers.innerText = `{${i}}`;
  leftFloorsNumbers.setAttribute("class", "leftFloorsNumbers");

  leftFloors.append(leftFloorsNumbers);
  leftFloors.appendChild(leftWallsImg);
  leftWalls.appendChild(leftFloors);
  // right side
  let rightFloors = document.createElement("div");
  rightFloors.setAttribute("class", "rightFloors");
  let rightWallsImg = document.createElement("img");
  rightWallsImg.setAttribute("class", "rightWallsImg");
  rightWallsImg.src = "./imgs/wall-brick-arrow-black-wallpaper-preview.jpg";

  let rightFloorsNumbers = document.createElement("div");
  rightFloorsNumbers.innerText = `{${i}}`;
  rightFloorsNumbers.setAttribute("class", "rightFloorsNumbers");

  rightFloors.append(rightFloorsNumbers);
  rightFloors.appendChild(rightWallsImg);
  rightWalls.appendChild(rightFloors);
}

for (let i = 10; i >= 1; i--) {
  buttonDiv = document.createElement("div");
  buttonDiv.setAttribute("class", "buttonDiv");
  buttonDiv.innerText = `${i}`;
  buttonImg = document.createElement("img");
  buttonImg.setAttribute("class", "buttonImg");
  buttonImg.src = "./imgs/button.png";
  buttonDiv.appendChild(buttonImg);

  rightSide.append(buttonDiv);

  // for laterr //////////////////////////////////////////////////////////////////////////////////
  // let rightButtonDivUp=document.createElement("div")                                          /
  // rightButtonDivUp.setAttribute("class","rightButtonDivUP")                                   /
  // let rightButtonDivDown=document.createElement("div")                                        /
  // rightButtonDivDown.setAttribute("class","rightButtonDivDown")                               /
  // let rightButtonImgUp=document.createElement("img")                                          /
  // rightButtonImgUp.setAttribute("class","rightButtonImg")                                     /
  // rightButtonImgUp.src="./imgs/up.png"                                                        /
  // let rightButtonImgDown=document.createElement("img")                                        /
  // rightButtonImgDown.setAttribute("class","rightButtonImg")                                   /
  // rightButtonImgDown.src="./imgs/down.png"                                                    /
  //
  // rightButtonDivUp.append(rightButtonImgUp)                                                   /
  // rightButtonDivDown.append(rightButtonImgDown)                                               /
  // rightSide.append(rightButtonDivUp)                                                          /
  // rightSide.append(rightButtonDivDown)                                                        /
  // for laterr //////////////////////////////////////////////////////////////////////////////////
}
let children = [...rightSide.children];
console.log(children);
//adding and removing floor queue/////////////////////////////////////////////////////////
rightSide.addEventListener("click", function (event) {
  if (!queue.length) {
    window.requestAnimationFrame(moveLift);
  }

  event.target.classList.toggle("buttonPushed");
  event.stopPropagation();
  if ([...event.target.classList].some((el) => el === "buttonPushed")) {
    queue.push(+event.target.innerText);
  }
  if ([...event.target.classList].every((el) => el !== "buttonPushed")) {
    let removedElemIndex = queue.findIndex(
      (el) => el === +event.target.innerText
    );
    queue.splice(removedElemIndex, 1);
  }
});

async function moveLift() {
  let currentFloor = Math.max(liftPosition / lift.clientHeight) + 1;
  let myReq = requestAnimationFrame(moveLift);
  let nextFloor = findNextFloor(change, currentFloor);

  if (!queue.length || !nextFloor) {
    cancelAnimationFrame(myReq);
    return;
  }

  if ((nextFloor - 1) * eachFloor > liftPosition) {
    change = +2;
  } else if ((nextFloor - 1) * eachFloor < liftPosition) {
    change = -2;
  }
  liftPosition = liftPosition + change;
  lift.style.bottom = liftPosition + change + "px";
  if ((nextFloor - 1) * eachFloor == liftPosition) {
    cancelAnimationFrame(myReq);
    await sleep(3000);
    queue.splice(queue.indexOf(nextFloor), 1);
    
    children
      .find((el) => el.innerText === String(nextFloor))
      .classList.remove("buttonPushed");
    
    requestAnimationFrame(moveLift);
  }
}

function findNextFloor(moveDirection, currentFloor) {
  if (moveDirection < 0 && queue.filter((el) => el < currentFloor).length) {
    return Math.max(...queue.filter((el) => el < currentFloor));
  }
  if (moveDirection > 0 && queue.filter((el) => el > currentFloor).length) {
    return Math.min(...queue.filter((el) => el > currentFloor));
  }
  if (queue.length) {
    return Math.max(...queue);
  }
  return currentFloor;
}

function sleep(ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}
