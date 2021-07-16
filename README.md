# ipfs-cid #
JavaScript Implementation of the [ipfs](https://ipfs.io/) cid generator.

## Install ##

``` shell
npm install --save ipfs-cid
```

## Usage ##

``` javascript
const {createGenerator} = require('ipfs-cid');
const fs = require('fs');

main();

async function main(){
    const generator = createGenerator();
    const fileStream = fs.createReadStream('.../xxx');
    const cid1 = await generator.generate(transform(fileStream));
    // example: CID(QmaL1KiQRV8secNszpjjFPg722T53c77k2dz5UsNua59ZT)
    return cid1;
}

async function *transform(stream){
    for await (let chunk of stream){
        yield new Uint8Array(chunk);
    }
}

```
