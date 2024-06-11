const express = require('express');
const path = require('path');
const router = require('./router/router')
const moment = require('moment');
const app = express();

app.set('vie engine', 'ejs');

const PORT = 5555;

app.use(express.static('ejs'));
app.use(express.json())
app.use('/api', router)

const createPath = (page) => path.resolve(__dirname, 'ejs', `${page}.ejs`);

app.listen(PORT, async (error) => {
	error ? console.log(error) : 'server is started';
})


app.get('/', async (req, res) => {
	try {
		const data = await fetch(`http://localhost:${PORT}/api/home`);
		const sections = await data.json();
		if (sections) {
			res.render(createPath('home'), { sections: sections });
		} else {
			res.status(404).send('Section not found');
		}
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
});

app.get('/section/:id', async (req, res) => {
	const sectionId = parseInt(req.params.id);
  try {
    const Response = await fetch(`http://localhost:${PORT}/api/section/${sectionId}`);
		const data = await Response.json();
    if (data) {
      res.render(createPath('section'), { 
				sectionNum: sectionId,
				plants: data.plants,
				section: data.section[0],
				moment: moment
				 });
    } else {
      res.status(404).send('Section not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});