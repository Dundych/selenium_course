function doHomeworkPromise(subject, sec) {
    return new Promise(function (resolve, reject) {
        console.log(`Starting my ${subject} homework at ${Date(Date.now()).toLocaleString()}`);
        setTimeout(function () {
            resolve(`${sec} seconds past`);
        }, sec * 1000);
    });
}

function doRestPromise(sec) {
    return new Promise(function (resolve, reject) {
        console.log(`Starting rest at ${Date(Date.now()).toLocaleString()}`);
        setTimeout(function () {
            resolve(`${sec} seconds past`);
        }, sec * 1000);
    });
}
function doCleenupPromise(sec) {
    return new Promise(function (resolve, reject) {
        console.log(`Starting cleenup at ${Date(Date.now()).toLocaleString()}`);
        setTimeout(function () {
            resolve(`${sec} seconds past`);
        }, sec * 1000);
    });
}

async function runner() {
    let hwRes = await doHomeworkPromise('math', 6);
    console.log(hwRes);
    let rRes = await doRestPromise(3);
    console.log(rRes);
    let hw2Res = await doHomeworkPromise('english', 6);
    console.log(hw2Res);
    let cRes = await doCleenupPromise(4);
    console.log(cRes);
}

runner();