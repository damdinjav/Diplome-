const mongoose = require('mongoose');
require('dotenv').config();

const email = 'damdinjavsh672@gmail.com'; // ← өөрийн имэйлээ энд бичнэ

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await mongoose.connection.collection('users').updateOne(
    { email: email },
    { $set: { role: 'admin' } }
  );
  console.log('Амжилттай! Өөрчлөгдсөн:', result.modifiedCount);
  process.exit();
}).catch(err => {
  console.error('Алдаа:', err.message);
  process.exit(1);
});