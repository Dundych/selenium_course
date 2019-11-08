// let promise = new Promise(function (resolve, reject) {
//     if ("Hypotetic error condition" == 1) {
//         return reject(new Error("Some Error"));
//     }
//     setTimeout(() => resolve("done!"), 1000);
// });

// promise.then(function(res){
//     console.log(res);
// }).catch(function (err) {
//     console.error(err);
// });

// promise.then((res)=> {
//     console.log(res);
// }).catch((err)=> {
//     console.error(err);
// });


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



// doHomeworkPromise('math', 6).then((hwRes) => {
//     console.log(hwRes);
//     doRestPromise(3).then((rRes) => {
//         console.log(rRes);
//         doHomeworkPromise('english', 6).then((hw2Res) => {
//             console.log(hw2Res);
//             doCleenupPromise(4).then((cRes) => {
//                 console.log(cRes);
//             });
//         });
//     });
// });

//Chaining promices
doHomeworkPromise('math', 6)
    .then((hwRes) => {
        console.log(hwRes);
        return doRestPromise(3);
    })
    .then((rRes) => {
        console.log(rRes);
        return doHomeworkPromise('english', 6);
    })
    .then((hwRes) => {
        console.log(hwRes);
        return doRestPromise(3);
    })
    .then((hw2Res) => {
        console.log(hw2Res);
        return doCleenupPromise(4);
    })
    .then((cRes) => {
        console.log(cRes);
    });
