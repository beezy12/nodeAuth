'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');

app.get('/', (req, res) => {
	res.render('index');
})



app.listen(PORT, () => {
	console.log(`app server is running on port ${PORT}`)
})
