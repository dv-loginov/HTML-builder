const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

stream.on('readable', () => {
  const data = stream.read();
  if (data != null) console.log(data);
});

stream.on('error', error => console.log('Error', error.message));
