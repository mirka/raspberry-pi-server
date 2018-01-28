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
	getJsonAndRoute(getList, req, res);
});

router.put('/api/items', (req, res) => {
	putJsonToFile('list', req, res);
});

router.get('/api/items/needed', (req, res) => {
	getJsonAndRoute(getNeededList, req, res);
});

router.put('/api/items/needed', (req, res) => {
	putJsonToFile('needed', req, res);
});


// ====================================
// Helpers
// ====================================

// Get data object of all items
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

// Get data object of needed items
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

// Route (send) data
function getJsonAndRoute(jsonPromiseFunc, req, res) {
	jsonPromiseFunc()
		.then((list) => {
			res.send(list);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
}

// Write routed json data to file
function putJsonToFile(fileName, req, res) {
	fs.writeFile(`${dataPath}/${fileName}.json`, JSON.stringify(req.body), (err) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.sendStatus(200);
		}
	});
}

module.exports = router;
