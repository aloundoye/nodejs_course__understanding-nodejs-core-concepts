const fs = require("fs/promises");


(async () => {
  //commands
  const CREATE_FILE = 'create a file';

  const commandFileHandler = await fs.open('./command.txt', 'r');

  commandFileHandler.on('change', async () => {
    console.log('The file was changed...');

      const size = (await commandFileHandler.stat()).size;
      const buffer = Buffer.alloc(size);
      const length = buffer.byteLength;
      const offset =0;
      const position = 0;
      const content = await commandFileHandler.read(
        buffer,
        offset,
        length,
        position
      );
      const command = buffer.toString('utf-8');

      if(command.includes(CREATE_FILE)){
        const filepath = command.substring(CREATE_FILE.length + 1);
        console.log(filepath);
        createFile(filepath);
      }
  });

  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit('change');
    }
  }

  await commandFileHandler.close();
})();

const createFile = async (path) => { 
  try {
    const isFileExists = await fs.open(path, 'r');
    isFileExists.close();
    return console.log(`the file ${path} already exists`);
  } catch (error) {
    const newFile = await fs.open(path, 'w');
    console.log('A new file was created');
    newFile.close();
  }
}