module.exports = function getMin(arr) {
    let min = arr[0]
    for (let i = 0; i < arr.length; i++) {
        min = arr[i] < min ? arr[i] : min
    }
    return min
}