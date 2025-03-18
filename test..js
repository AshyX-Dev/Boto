const b = { myKey: {a: "hi"}, anotherKey: "Goodbye" };
const newB = Object.keys(b).reduce((acc, key) => {
    if (key !== 'myKey') acc[key] = b[key];
    return acc;
}, {});
console.log(newB); // Output: { anotherKey: "Goodbye" }
const dd = [];

if (dd instanceof Array){
    console.log("HHIIH")
}