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

function parseLevel(txt, name, definitions) {
  var currentRow = new Row();
  const arr = new Level({name, tileSpacing: 5});
  const map = new TilemapText();
  
  //map.useDefinition();
  
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
  
  // Adds all the rows to "arr"
  map.onNewY(() => {
    arr.addRow(currentRow);
    currentRow = new Row();
  });
  
  // Loops through all the characters in the file
  // and matches them with the characters set above
  map.run(txt);
  
  // Returns a promise that only returns after
  // the level is finished parsing
  return new Promise(
    (res) => {
      // When the level map is finished, it runs
      // the function "res" with the level array
      map.finished(() => res(arr))
    },
  );
}

export async function loadLevel({name, scene, camera, definitions}) {
  for(const i in definitions) {
    definitions[i] = 
    `/assets/scripts/3d/definitions/${definition[i]}.json`;
  }
  
  const txt = await getLevel(`/assets/scripts/3d/levels/${name}.txt`);
  const level = await parseLevel(txt, name, definitions);
  console.log(level)
  level.addToScene(scene);

  return scene;
}