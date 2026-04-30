const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const password = 'Admin@123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('New hash:', hash);
  
  const result = await mongoose.connection.db.collection('users').updateOne(
    { email: 'damdinjavsh672@gmail.com' },
    { $set: { password: hash } }
  );
  
  console.log('modified:', result.modifiedCount);
  
  // Шалгах
  const user = await mongoose.connection.db.collection('users').findOne({ email: 'damdinjavsh672@gmail.com' });
  const match = await bcrypt.compare(password, user.password);
  console.log('match after update:', match);
  
  process.exit();
});