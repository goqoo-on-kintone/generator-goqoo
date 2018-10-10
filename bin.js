#!/usr/bin/env node
'use strict'
const { spawnSync } = require('child_process')

const [subCommand, ...args] = process.argv.slice(2)
let subGenerator

switch (subCommand) {
  case 'init':
    subGenerator = 'app'
    break
  case 'generate':
  case 'g':
    subGenerator = `g-${args.shift()}`
    break
  default:
    console.error(`goqoo: Unknown command '${subCommand}'`)
    process.exit(1)
}

const yeoman = spawnSync('yo', [`goqoo:${subGenerator}`, ...args], { stdio: 'inherit' })
process.exit(yeoman.code)
