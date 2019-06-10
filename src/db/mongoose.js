const mongoose = require('mongoose');

const connectionURL = process.env.DB_URL,
      dbOptions= {
          useNewUrlParser:true,
          useCreateIndex:true
      };

mongoose.connect(connectionURL, dbOptions);