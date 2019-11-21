beforeAll(() => {
    console.log('before all');
});

afterAll(() => {
    console.log('after all');
});

test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
});

test('object assignment', () => {
    const data = { one: 1 };
    data['two'] = 2;
    expect(data).toEqual({ one: 1, two: 2 });
});

test('adding positive numbers is not zero', () => {
    for (let a = 1; a < 10; a++) {
        for (let b = 1; b < 10; b++) {
            expect(a + b).not.toBe(0);
        }
    }
});

test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
});

test('zero', () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
});

test('two plus two', () => {
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);
    expect(value).toBeGreaterThanOrEqual(3.5);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);

    // toBe and toEqual are equivalent for numbers
    expect(value).toBe(4);
    expect(value).toEqual(4);
});

function doHomeworkPromise(subject, sec) {
    return new Promise(function (resolve, reject) {
        console.log(`Starting my ${subject} homework at ${Date(Date.now()).toLocaleString()}`);
        setTimeout(function () {
            resolve(`${sec} seconds past`);
        }, sec * 1000);
    });
}

test('resolves promices', () => {
    expect(doHomeworkPromise('math', 5)).resolves.toEqual('5 seconds past');
});

test('and asynk too', async () => {
    let homeworkResult = await doHomeworkPromise('math', 5)
    expect(homeworkResult).toEqual('5 seconds past');
});
