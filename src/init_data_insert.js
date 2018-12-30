const fs = require("fs");
const axios = require("axios");

const ax = axios.create({
	baseURL: "http://localhost:1337/parse/",
	timeout: 80000,
	headers: {
		"X-Parse-Application-Id": "myapp",
		"Content-Type": "application/json"
	}
});

var rawdata = fs.readFileSync("assets/kt_categories.json");
var catlist = JSON.parse(rawdata);

for (let i = 0; i < catlist.length; i++) {
	ax.post("classes/category", catlist[i])
		.then(function(response) {
			console.log(response);
		})
		.catch(function(error) {
			console.log(error);
		});
	console.log(catlist[i]);
}

rawdata = fs.readFileSync("assets/kt_kindtypes.json");
catlist = JSON.parse(rawdata);

for (let i = 0; i < catlist.length; i++) {
	ax.post("classes/kindtype", catlist[i])
		.then(function(response) {
			console.log(response);
		})
		.catch(function(error) {
			console.log(error);
		});
	console.log(catlist[i]);
}

rawdata = fs.readFileSync("assets/kt_instances.json");
catlist = JSON.parse(rawdata);

for (let i = 0; i < catlist.length; i++) {
	ax.post("classes/instance", catlist[i])
		.then(function(response) {
			console.log(response);
		})
		.catch(function(error) {
			console.log(error);
		});
	console.log(catlist[i]);
}

/*
ax.post("classes/test", {
	score: { firsthalf: "15", secondhalf: "25" },
	playerName: "Tom",
	cheatMode: ["A", "C"]
})
	.then(function(response) {
		console.log(response);
	})
	.catch(function(error) {
		console.log(error);
	});
*/
