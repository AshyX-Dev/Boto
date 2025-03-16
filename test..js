function getGroupsOfFive(array) {
    const result = [];
    for (let i = 0; i < array.length; i += 5) {
        result.push(array.slice(i, i + 5));
    }
    return result;
}

// Example usage
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const groupedItems = getGroupsOfFive(items);
console.log(Math.max(groupedItems));
