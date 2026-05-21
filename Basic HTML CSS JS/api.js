// greet()
// function greet() {
// console.log("Hello!");
// }
// function greet() {
// console.log("Hello22!");
// }

const { func } = require("joi");

// 1) Deep copy vs Shallow copy?
// Ans: Deep copy means all values from existing varibales are copied and disconnected from the original variable.
// Shallow copy means only level 1 values are copied and connected to the original variable.
function question1() {
  const testObj1 = {
    name: "John",
    address: {
      city: "New York",
      state: "NY",
    },
  };
  // Here for both spread operator and Object.assign() only level 1 values are copied, so if level 2 values are modified, the copied version will also be affected. Whereas for JSON.parse(JSON.stringify()) all values are copied and disconnected from the original variable, so if level 2 values are modified, the copied version will not be affected.
  // const testObj2={...testObj1};
  // const testObj2=Object.assign({},testObj1);
  const testObj2 = JSON.parse(JSON.stringify(testObj1));
  testObj1.address.city = "Jane";
  console.log("testObj1=====>", testObj1);
  console.log("testObj2=====>", testObj2);
}
question1();

// 2) Why JSON.parse(JSON.stringify()) is not a good way to copy an object that contains functions, undefined, Infinity, NaN, or special objects like Date?
// Ans: When you use JSON.stringify() on an object, it converts the object into a JSON string. During this process:
// - Functions are not included in the JSON string, so they will be lost when you parse it back to an object.
// - undefined values are also not included in the JSON string, Infinity and NaN are not valid JSON values so they will be lost as well.

// 3) Why arrays and objects are shallow copied and primitive types(Ex: numbers, strings, booleans) are deep copied??
// Ans: When you copy an array or object, the reference to the original is copied, not the actual values. This means that if you modify the original array or object, the copied version will also be affected. Primitive types are deep copied because they are stored as values, not references.

// Note: JSON.parse(JSON.stringify()) creates a deep copy, but not to be used for objects with functions, undefined, Infinity, Nan or special objects like Date. It will not work correctly for those cases. In the example below, the sampleFunction, sampleUndefined, sampleinfinity, and sampleNan properties will not be preserved in the testObj2 after the JSON serialization and deserialization process. The sampleDate property will also be converted to a string and will not retain its Date object functionality.
function question2() {
  const testObj1 = {
    sampleDate: new Date(),
    sampleFunction: function () {
      console.log("Hello World");
    },
    sampleLog: console.log,
    sampleUndefined: undefined,
    sampleinfinity: -Infinity,
    sampleNan: NaN,
  };
  // let testObj2={}; // If we want to copy, then we have to manually copy 1 by 1
  // testObj2.sampleFunction=testObj1.sampleFunction;
  const testObj2 = JSON.parse(JSON.stringify(testObj1));
  // const testObj2=Object.assign({},testObj1);
  console.log("testObj1=====>", testObj1);
  console.log("testObj2=====>", testObj2);
}
// question2();


// Real life closure example:
function createLogger(prefix){
    return function(message){
        console.log(`${prefix} ${message}`)
    }
}
const infoLogger=createLogger("INFO:");
const errorLogger=createLogger("ERROR:");
infoLogger("This is an info message");
errorLogger("This is an error message");

function one(){
    console.log("first")
    function two(){
        console.log("second")
    }
    return two;
}
const output=one();
output()


var square=function (num) {
    console.log(num * num);
    return num * num;
}
// console.log(square); 
// console.log(square(5)); // Output: 25


const a=23;
function n(){
    function m(){
        console.log("=====>",a);
    }
    return m;
}
const ab=n()
ab()