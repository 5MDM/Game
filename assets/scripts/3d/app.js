import {$, eventOnce, stopLoop} from "../util.js";

export const renderer = new THREE.WebGLRenderer({
  canvas: $("#c"),
  precision: "lowp",
  antialias: false,
});

const dpi = devicePixelRatio;
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
eventOnce("resize", () => renderer.setSize(innerWidth, innerHeight))

eventOnce("resize", () => {
  $("#c").setAttribute("width", innerWidth * dpi);
  $("#c").setAttribute("height", innerHeight * dpi);
  $("#c").style.width = innerWidth + "px";
  $("#c").style.height = innerHeight + "px";
});

var currentScene;
var currentCam;
var currentWorld;

export function setCurrentScene(e) {currentScene = e}

export function setCurrentCam(e) {currentCam = e}

export function setCurrentWorld(e) {currentWorld = e}

export const renderLoop = stopLoop(() => {
  currentWorld.stepSimulation(1/30, 10)
  renderer.render(currentScene, currentCam);
}, false);