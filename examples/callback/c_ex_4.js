function doHomework(subject, sec, callback) {
    console.log(`Starting my ${subject} homework at ${Date(Date.now()).toLocaleString()}`);
    setTimeout(function () {
        console.log(`${sec} seconds past`);
        if (callback) {callback();}
    }, sec * 1000);
}
function doRest(sec, callback) {
    console.log(`Starting rest at ${Date(Date.now()).toLocaleString()}`);
    setTimeout(function () {
        console.log(`${sec} seconds past`);
        if (callback) {callback();}
    }, sec * 1000);
}
function doCleenup(sec, callback) {
    console.log(`Starting cleenup at ${Date(Date.now()).toLocaleString()}`);
    setTimeout(function () {
        console.log(`${sec} seconds past`);
        if (callback) {callback();}
    }, sec * 1000);
}
doHomework('math', 6);
doRest(3);
doHomework('english', 6);
doCleenup(4);

// doHomework('math', 6, 
//     doRest(3, 
//         doHomework('english', 6,
//             doCleenup(4)
//         )
//     )
// );

doHomework('math', 6, function () {
    doRest(3, function () {
        doHomework('english', 6, function () {
            doCleenup(4);
        })
    })
});