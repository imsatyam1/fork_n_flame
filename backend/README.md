```sh
tsc --init
rootDir - => src
outDir -> dist
include src

`````sh
touch nodemon.json
{
    "exec": "ts-node",
    "watch": ["src"],
    "ext": "ts",
    "ignore": ["node_modules"]
  }
  
``


```sh
nodemon src/index.ts
```
