const { Buffer } = require("buffer");

const buffer = Buffer.alloc(10000);

console.log(Buffer.poolSize >>> 1);
const unsafeBuffer = Buffer.allocUnsafe(10000);

const buff = Buffer.allocUnsafeSlow(2);

// Buffer.from();
// Buffer.concat();

for (let i = 0; i < unsafeBuffer.length; i++) {
  if (unsafeBuffer[i] !== 0) {
    console.log(
      `Element at position ${i} has value: ${unsafeBuffer[i].toString(2)}`
    );
  }
}
