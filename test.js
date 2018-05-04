var testFunc = require("./server")
var accs = [{"user":"hi","pass":"5f4dcc3b5aa765d61d8327deb882cf99","saved":[]},{"user":"jason","pass":"2b877b4b825b48a9a0950dd5bd1f264d","saved":["600 Dunsmuir Street, Vancouver","80 Pine St, New York","885 Dunsmuir St, Vancouver","600 Dunsmuir Street, Vancouver","720 Granville St, Vancouver","398 Robson St Unit #5, Vancouver","811 Hornby St, Vancouver"]}]

var success = {
    body: {
        username: 'jason',
        password: 'jason'
    }
}
var fail = {
    body: {
        username: 'jason',
        password: 'wrong'
    }
}

describe('login', () => {
    test("pass", () => {
        expect(testFunc.LoginCheck(success, accs)).toBe(0)
    })
    test("fail", () => {
        expect(testFunc.LoginCheck(fail, accs)).toBe(undefined)
    })
    
})