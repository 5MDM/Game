import {stopLoop, stepLoop, $, RADIAN_HALF, clamp, parseCSS, $$} from "../util.js";
import {loadLevel} from "./levelLoader.js";
import {newCamera, updateCamera, MovementCamera, message} 
from "../3d.js";
import {setCurrentCam, setCurrentScene, setCurrentWorld, renderLoop} 
from "./app.js";
import {settings, settingsObj} from "../settings.js";

const scene = new THREE.Scene();
const cam = new MovementCamera({
  camera: {fov: 80},
});

var mouseUnlocked;

const controlKeys = [
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
]
/*
stopLoop(() => {
  cam.moveUp();
});
*/

async function play() {
  // loadLevel({
  //   name: "tutorial",
  //   scene,
  //   camera: cam.camera,
  // }).then(main);
  await Ammo();
  const world = setupPhysics();
  setCurrentWorld(world);
  const level = (await import("./levels/tutorial.js")).default;
  level.addToScene(scene, world);
  cam.setWorld(world);
  main()
}

function main() {
  cam.bind($("#c"));
  cam.setDefault(cam.camera, 0, 0);
  cam.enable();
  setCurrentScene(scene);
  setCurrentCam(cam.camera);
  renderLoop.start();
  
  cam.onPointerMove = function(e) {
    cam.rx += e.x * 0.005 * settingsObj.sensitivity;
    cam.ry = clamp(
      -Math.PI / 3,
      cam.ry + e.y * 0.005 * settingsObj.sensitivity,
      Math.PI / 3,
    );
  };
  
  cam.onMovement = s => s;
  
  addMobileControls();
  addMouseControls();
  // Ammo().then(setupPhysics);
}

function setupPhysics(physicsWorld) {
  const collisionOpts = 
  new Ammo.btDefaultCollisionConfiguration();
  
  const dispatcher = 
  new Ammo.btCollisionDispatcher(collisionOpts);
  
  const overlapCache = 
  new Ammo.btDbvtBroadphase();
  
  const solver = 
  new Ammo.btSequentialImpulseConstraintSolver();
  
  const world =
  new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    overlapCache,
    solver,
    collisionOpts,
  );
  
  world.setGravity(new Ammo.btVector3(0, -9.81, 0));

  return world;
}

function addMobileControls() {
  const moving = {
    up: false,
    left: false,
    down: false,
    right: false,
  };
  const movementLoop = stopLoop(() => {
    if(moving.up) cam.moveUp      (0.1);
    if(moving.left) cam.moveLeft  (0.1);
    if(moving.down) cam.moveDown  (0.1);
    if(moving.right) cam.moveRight(0.1);
  });
  
  const controls = $("#ui > #controls");
  const up = $$("button", {
    down(e) {moving.up = true},
    up(e) {moving.up = false},
    children: "Up",
  });
  
  const right = $$("button", {
    down(e) {moving.right = true},
    up(e) {moving.right = false},
    children: "Right",
  });
  
  const down = $$("button", {
    down(e) {moving.down = true},
    up(e) {moving.down = false},
    children: "Down",
  });
  
  const left = $$("button", {
    down(e) {moving.left = true},
    up(e) {moving.left = false},
    children: "Left",
  });
  
  const interact = $$("button", {
    children: "Interact",
  });
  
  const inventory = $$("button", {
    children: "Inventory",
  });
  
  const topRow = $$("div", {
    attrs: {
      id: "top-row",
      style: parseCSS({
        display: "flex",
        "flex-direction": "row",
      }),
    },
    children: [interact, up, inventory],
  });
  
  const bottomRow = $$("div", {
    attrs: {
      id: "bottom-row",
      style: parseCSS({
        display: "flex",
        "flex-direction": "row",
      }),
    },
    children: [left, down, right],
  });
  
  const co = $$("div", {
    attrs: {
      id: "gamepad",
      style: parseCSS({
        "margin-bottom": "50px",
      }),
    },
    children: [topRow, bottomRow],
  });
  controls.appendChild(co);

  document.addEventListener("keydown", (e) => {
    controls.style.display = "none";
    if ((Date.now() - mouseUnlocked) >= 1500 && $("#c").requestPointerLock && controlKeys.includes(e.code)) {
      $("#c").requestPointerLock();
    }
    if (e.code == "KeyW" || e.code == "ArrowUp") moving.up = true;
    if (e.code == "KeyA" || e.code == "ArrowLeft") moving.left = true;
    if (e.code == "KeyS" || e.code == "ArrowDown") moving.down = true;
    if (e.code == "KeyD" || e.code == "ArrowRight") moving.right = true;
  })

  document.addEventListener("keyup", (e) => {
    if (e.code == "KeyW" || e.code == "ArrowUp") moving.up = false;
    if (e.code == "KeyA" || e.code == "ArrowLeft") moving.left = false;
    if (e.code == "KeyS" || e.code == "ArrowDown") moving.down = false;
    if (e.code == "KeyD" || e.code == "ArrowRight") moving.right = false;
  })
}

function addMouseControls() {

  const mousemove = (e) => {
    cam.rx += e.movementX * -0.005 * settingsObj.sensitivity;
    cam.ry = clamp(
      -Math.PI / 3,
      cam.ry + e.movementY * -0.005 * settingsObj.sensitivity,
      Math.PI / 3,
    )
  }
  
  $("#c").onmousemove = mousemove;

  if ($("#c").requestPointerLock) $("#c").requestPointerLock();

  document.addEventListener("click", (e) => {
    if ((Date.now() - mouseUnlocked) < 1500) {
      message.show("Cannot lock cursor too fast", "warning", 1500);
      return;
    }
    $("#c").requestPointerLock()
  });

  document.addEventListener("pointerlockchange", (e) => {
    if (document.pointerLockElement == $("#c")) {
      // Pointer locked
      $("#c").onmousemove = mousemove;
      if (message.get() == "Cannot lock cursor too fast") message.hide();
    } else {
      // Pointer unlocked
      $("#c").onmousemove = null;
      mouseUnlocked = Date.now()
    }
  })
}

export {play};