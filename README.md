# ipfs-cid #
JavaScript Implementation of the [ipfs](https://ipfs.io/) cid generator.

## Install ##

``` shell
npm install --save ipfs-cid
```

## Usage ##

``` javascript
const {createGenerator} = require('ipfs-cid');
const {BufferGenerator} = require('ipfs-cid/extensions/buffer');
const fs = require('fs');

main().catch(e=>console.error(e));

async function main(){
    
    const generator = createGenerator();
    generator.mount(BufferGenerator.createInstance());
    
    const fileStream = fs.createReadStream('.../xxx');
    const cid1 = await generator.generate(fileStream);
    // example: CID(QmaL1KiQRV8secNszpjjFPg722T53c77k2dz5UsNua59ZT)
    return cid1;
}

```
