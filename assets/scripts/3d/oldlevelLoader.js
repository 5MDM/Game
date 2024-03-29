import {TilemapText, mderr, randomColor} from "../util.js";
import {newBox} from "../3d.js";

async function getLevel(name) {
  const data = 
  await fetch(`/assets/scripts/3d/levels/${name}.txt`);
  const txt = await data.text();
  
  if(txt[0] == "<"
  && txt[1] == "!")
    console.error(mderr("404 file recieved"));
  
  const arr = [];
  var xarr = "";
  for(const i of txt) if(i == "\n") {
    arr.unshift(xarr);
    xarr = "";
  } else {
    xarr += i;
  }
  arr.unshift(xarr);
  
  return arr;
}

var centerX = 0;
var centerY = 0;

export async function loadLevel({name, scene, camera} = {}) {
  if((name && scene && camera) == undefined)
    return console.error(mderr(
      `Didn't receive proper arguments for `
    + `the level loader @levelLoader.js`
    ));
  
  const level = await getLevel(name);
  
  console.log(level.split("\n"));
}

function parseLevel({level, scene, camera, res}) {
  const tilemap = new TilemapText();
  tilemap.use(o => {
    o.x -= centerX;
    o.y -= centerY;
  });
  const cache1 = new THREE.BoxGeometry(5, 5, 5);
  tilemap.key("#", ({x, y}) => {
    const box = new THREE.Mesh(
      cache1,
      new THREE.MeshBasicMaterial({color: randomColor()}),
    );
    //const box = newBox(5, randomColor());
    x *= 5;
    y *= 5;
    box.position.x = x;
    box.position.z = y;
    scene.add(box);
  }).run(level);
  tilemap.finished(res);
}