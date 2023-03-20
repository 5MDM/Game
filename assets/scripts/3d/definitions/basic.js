import {Block, Spawn} from "../gameItems.js";

export function run({map, currentRow}) {
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
}
