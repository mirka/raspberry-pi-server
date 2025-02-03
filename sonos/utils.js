/**
 * @template T
 * @param {Array<T>} arr
 * @returns {T}
 */
function getRandomItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
	getRandomItem,
};
