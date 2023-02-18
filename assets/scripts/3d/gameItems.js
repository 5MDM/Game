import { randomColor } from "../util.js";
import {newBox} from "../3d.js";

class Item {
  type;
  generate = () => void 0;
}

const cache1 = (() => {
 const size = 5;
 return new THREE.BoxGeometry(size, size, size); 
})();

class Block extends Item {
  type = "COLOR";
  constructor({ color = "RANDOM", height = 5, collide = true, width = 5 } = {}) {
    super();
    if ((typeof color !== "number" && color !== "RANDOM") 
    || color > 0xffffff || color < 0) throw new SyntaxError("Invalid color");
    if (typeof height !== "number") throw new SyntaxError("Invalid height");
    if (typeof collide !== "boolean") throw new SyntaxError("Invalid collide");

    this.color = color;
    if (color === "RANDOM") this.color = randomColor();
    this.height = height;
    this.width = width;
    this.collide = collide;
    return this;
  }
  
  generate = function() {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.width),
      new THREE.MeshBasicMaterial({color: this.color}),
    );

    box.position.y = (this.height - 5) / 2;

    return box
  }
}

class Spawn extends Item {
  type = "SPAWN";
  constructor() {
    super();
    console.warn("Spawn is deprecated, it will not do anything. Use Level.setSpawn(x, z) instead.")
  }
}

class Row {
  constructor(items = []) {
    if (!Array.isArray(items)) throw new SyntaxError("Invalid items")

    this.items = items
    return this
  }
  addItem(item) {
    if (!(item instanceof Item) && item != null) throw new SyntaxError("Invalid item")
    
    this.items.push(item)
    return this
  }
  addItems(...items) {
    if (Array.isArray(items[0])) items = items[0]
    
    this.items.push(...items)
    return this
  }
}

class Level {
  settings = {
    name: undefined,
    tileSpacing: 5,
    spawnX: 0,
    spawnZ: 0,
  };
  rows = [];
  constructor({ name, tileSpacing = 5 } = {}) {
    if (!name) throw new SyntaxError("Invalid name")
    this.settings.name = name
    this.settings.tileSpacing = tileSpacing
    return this
  }

  addRow(row) {
    if (!(row instanceof Row)) throw new SyntaxError("Invalid row")

    this.rows.push(row)
    return this
  }
  addRows(...rows) {
    if (Array.isArray(rows[0])) rows = rows[0]
    
    this.rows.push(...rows)
    return this
  }

  setSpawn(x, z) {
    if (isNaN(x)) throw new SyntaxError("Invalid spawn X")
    if (isNaN(z)) throw new SyntaxError("Invalid spawn Z")

    this.settings.spawnX = x
    this.settings.spawnZ = z

    return this;
  }

  addToScene(scene, world) {
    this.rows.forEach((row, i) => {
      row.items.forEach((item, j) => {
        if (!item) return
        const mesh = item.generate()
        if (!mesh) return
        mesh.position.x = i * this.settings.tileSpacing - this.settings.spawnX * this.settings.tileSpacing
        mesh.position.z = j * this.settings.tileSpacing - this.settings.spawnZ * this.settings.tileSpacing
        scene.add(mesh)

        if (item.collide) {
          const shape = new Ammo.btBoxShape(new Ammo.btVector3(item.width / 2, item.height / 2, item.width / 2));
          const mass = 0;
          const localInertia = new Ammo.btVector3(0, 0, 0);
          shape.calculateLocalInertia(mass, localInertia);
          
          const transform = new Ammo.btTransform();
          transform.setIdentity();
          transform.setOrigin(new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z));
          
          const motionState = new Ammo.btDefaultMotionState(transform);
          const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
          const body = new Ammo.btRigidBody(rbInfo);
          
          world.addRigidBody(body);
        }
      })
    })

    return scene
  }
}

export { Block, Spawn, Row, Level }