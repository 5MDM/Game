import {TilemapText} from "../util.js";
import { Block, Spawn, Row, Level } from "./gameItems.js"

function getLevel(name) {
  return new Promise(
    res =>
      fetch(name)
      .then(e => e.text())
      .then(txt => res(txt.split("\n")))
  );
}

function parseLevel(txt, name) {
  var currentRow = new Row();
  const arr = new Level({name, tileSpacing: 5});
  const map = new TilemapText();
  map.key("#", (x, y) => {
    currentRow.addItem(new Block({ width: 5, height: 5 }));
  });
  map.key("@", ({x, y}) => {
    arr.setSpawn(x, y);
    currentRow.addItem(new Spawn());
  });
  map.key(" ", (x, y) => {
    currentRow.addItem(null);
  });
  map.onNewY(() => {
    arr.addRow(currentRow);
    currentRow = new Row();
  });
  map.run(txt);
  
  // Returns a promise that returns 
  return new Promise(
    res => map.finished(() => res(arr))
  );
}

export async function loadLevel({name, scene, camera}) {
  const txt = await getLevel(`/assets/scripts/3d/levels/${name}.txt`);
  const level = await parseLevel(txt, name);
  console.log(level)
  level.addToScene(scene);

  return scene;
}