import { Block, Row, Level, Spawn } from "../gameItems.js"

const whiteBlock = new Block({ color: 0xffffff, collide: true })
const blackFloor = new Block({ color: 0x121212, height: 0.1, collide: false })
const grayFloor = new Block({ color: 0x707070, height: 0.1, collide: false })

const level = new Level({ name: "tutorial" })
  .addRows(
    new Row()
      .addItems(whiteBlock, whiteBlock, whiteBlock, whiteBlock, whiteBlock),
    new Row()
      .addItems(whiteBlock,  grayFloor, blackFloor,  grayFloor, whiteBlock),
    new Row()
      .addItems(whiteBlock, blackFloor,  grayFloor, blackFloor, whiteBlock),
    new Row()
      .addItems(whiteBlock,  grayFloor, blackFloor,  grayFloor, whiteBlock),
    new Row()
      .addItems(whiteBlock, whiteBlock, whiteBlock, whiteBlock, whiteBlock),
  )
  .setSpawn(2, 2)

export default level