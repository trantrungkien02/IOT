const path = require('path');
const express = require('express');
const methodOverride = require('method-override');

const route = require('./routes');
const { connect } = require('./config/db/connectdb');

const port = 3000;
const app = express();

// Connect to DB
connect();
// Join path
app.use(express.static(path.join(__dirname, '/public')));

// Body parser
app.use(
  // submit by Form default behavior
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json()); // submit by JS

// Override method
app.use(methodOverride('_method'));

// Routes init
route(app);

// Run app
app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
