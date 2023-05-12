require('dotenv').config();

const express = require('express'),
      router = require('./routes'),
      app = express(),
      port = process.env.PORT,
      swaggerUi = require('swagger-ui-express'),
      swaggerFile = require('./swagger_output.json'),
      http = require('http'),
      bodyParser = require('body-parser');

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(bodyParser.json())

app.use('/', router);

http.createServer(app).listen(port)
console.log(`Example app listening on port ${port}`);
