const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const bodyParser = require('body-parser');
const userRoute = require('./routes/User');
const expenceRoute = require('./routes/Expence');
const purchaseRoute = require('./routes/Purchase');
const leaderBordRoute = require('./routes/LeaderBoard');
const passwordRoute = require('./routes/Password');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(bodyParser.json({ extended: false }));
app.use(cors());

// Routes
app.use("/users", userRoute);
app.use("/expence", expenceRoute);
app.use("/purchase", purchaseRoute);
app.use('/leaderboard', leaderBordRoute);
app.use('/password', passwordRoute);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });
