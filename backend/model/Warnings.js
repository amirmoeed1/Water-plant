const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  // Remove useNewUrlParser and useUnifiedTopology
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});
