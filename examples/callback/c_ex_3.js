function doHomework(subject, callback) {
    setTimeout(function () {
        console.log(`Starting my ${subject} homework.`);
        if (callback) {callback();}
    }, 2000);

}
function finished() {
    setTimeout(function () {
        console.log('Finished my homework');
    }, 1000);
    
}
doHomework('math');
finished();
// doHomework('math', finished);