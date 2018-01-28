const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const defaultList = require('./data/default-list.json');

const dataPath = __dirname + '/data';


router.use('/static', express.static(__dirname + '/static'));

router.get('/', (req, res) => {
	Promise.all([getList(), getNeededList()])
		.then((data) => {
			const allItems = data[0].items;
			const neededItems = data[1].items;

			allItems.forEach((item) => {
				const isNeeded = neededItems.some((neededItem) => {
					return neededItem.name === item.name;
				});

				if (isNeeded) {
					item.needed = true;
				}
			});

			res.render(__dirname + '/views/index.njk', {
				list: allItems,
				neededList: neededItems,
			});
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

router.get('/api/items', (req, res) => {
	getList()
		.then((list) => {
			res.send(list);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

router.put('/api/items', (req, res) => {
	fs.writeFile(dataPath + '/list.json', JSON.stringify(req.body), (err) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.get('/api/items/needed', (req, res) => {
	getNeededList()
		.then((list) => {
			res.send(list);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

router.put('/api/items/needed', (req, res) => {
	fs.writeFile(dataPath + '/needed.json', JSON.stringify(req.body), (err) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

function getList() {
	const listPath = dataPath + '/list.json';

	return new Promise((resolve, reject) => {
		fs.readFile(listPath, (err, data) => {
			if (err) {
				resolve(defaultList);
				fs.writeFile(listPath, JSON.stringify(defaultList), (err) => {
					if (err) reject(err);
				});
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
}

function getNeededList() {
	return new Promise((resolve, reject) => {
		fs.readFile(dataPath + '/needed.json', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
}

module.exports = router;
