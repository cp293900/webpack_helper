module.exports = function getMax(arr) {
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
        max = arr[i] > max ? arr[i] : max;
    }
    return max;
};