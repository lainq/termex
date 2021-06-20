require('console-png').attachTo(console);
const { readFile } = require('fs')

const displayImage = (imagePath) => {
	readFile(imagePath, (error, content) => {
		if(error){return null}
		console.png(content)
	})
}

module.exports = { displayImage }