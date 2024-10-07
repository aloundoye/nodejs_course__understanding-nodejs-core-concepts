const fs = require("fs/promises");


(async () => {
  //commands
  const CREATE_FILE = 'create a file';
  const DELETE_FILE = 'delete the file';
  const RENAME_FILE = 'rename the file';
  const ADD_TO_FILE = 'add to the file';

  const commandFileHandler = await fs.open('./command.txt', 'r');

  commandFileHandler.on('change', async () => {
    console.log('The file was changed...');

      const size = (await commandFileHandler.stat()).size;
      const buffer = Buffer.alloc(size);
      const length = buffer.byteLength;
      const offset = 0;
      const position = 0;
      const content = await commandFileHandler.read(
        buffer,
        offset,
        length,
        position
      );
      const command = buffer.toString('utf-8');

      /** CREATE FILE *
       * 
       * create a file <path>
       */
      if(command.includes(CREATE_FILE)){
        const filepath = command.substring(CREATE_FILE.length + 1);
        await createFile(filepath);
      }

      /** DELETE FILE *
       * 
       * delete the file <path>
       */
      if(command.includes(DELETE_FILE)){
        const filepath = command.substring(DELETE_FILE.length + 1);
        await delete_file(filepath);
      }

      /** RENAME FILE *
       * 
       * rename the file <path> to <new-path>
       */
      if(command.includes(RENAME_FILE)){
        const _idx = command.indexOf(' to ');
        const oldFilepath = command.substring(RENAME_FILE.length + 1, _idx);
        const newFilePath = command.substring(_idx + 4);
        await  rename_file(oldFilepath, newFilePath);
      }

      /** ADD TO THE FILE *
       * 
       * add to the file <path> this content: <content>
       */
      if(command.includes(ADD_TO_FILE)){
        const _idx = command.indexOf(' this content: ');
        const filepath = command.substring(ADD_TO_FILE.length + 1, _idx);
        const content = command.substring(_idx + 15);
        await add_to_file(filepath, content);
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
    const newFile = await fs.open(path, 'wx');
    await newFile.close();
    return console.log('A new file was created');
  } catch (error) {
    console.log('The file already exists')
  }
}

const delete_file = async (path) => {
  try {
    await fs.rm(path);
    return console.log('The file is deleted');
  } catch (error) {

    if(error.code ==='ENOENT'){
      console.error('No file at this path to remove.');
    } else{
      console.error(error);
    }
  }
}
const rename_file = async (oldPath, newPath) => {
  try {
    await fs.rename(oldPath, newPath);
    return console.log('The file is renamed');
  } catch (error) {
    if(error.code ==='ENOENT'){
      console.error('No file at this path to rename.');
    } else{
      console.error(error);
    }  }
}
const add_to_file = async (path, content) => {
  try {
    await fs.appendFile(path, content);
    return console.log('Content appended');
  } catch (error) {
    if(error.code ==='ENOENT'){
      console.error('No file at this path to add for.');
    } else{
      console.error(error);
    }  }
}
