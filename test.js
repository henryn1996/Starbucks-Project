var testFunc = require("./server")
var Accs = [{ "user": "jason", "pass": "2b877b4b825b48a9a0950dd5bd1f264d", "saved": ["600 Dunsmuir Street, Vancouver", "80 Pine St, New York", "885 Dunsmuir St, Vancouver", "600 Dunsmuir Street, Vancouver", "720 Granville St, Vancouver", "398 Robson St Unit #5, Vancouver", "811 Hornby St, Vancouver"] }]

var success = {
    body: {
        username: 'jason',
        password: 'jason',
        NewUser: 'notJason',
        NewPassword: 'goodpass',
        confirmp: 'goodpass'
    }
}

var fail = {
    body: {
        username: 'jason',
        password: 'wrong',
        NewUser: "jason",
        NewPassword: 'goodpass',
        confirmp: 'badpassw'

    }
}

/*  fail2: the length of username is shorter than 3.*/
var fail2 = {
    body: {
        NewUser: '1c',
        NewPassword: 'good',
        confirmp: 'good'
    }
}

/*  fail3: the length of username is longer than 12.*/
var fail3 = {
    body: {
        NewUser: 'thispasswordshouldbetoolongblahblah'
    }
}

/*  failSpecialChar: the username contains a special character.*/
var failSpeChar ={
    body: {
        NewUser: '&!=-*^)'
    }
}

/*  failSpace: the username contains a space.*/
var failSpace = {
    body: {
        NewUser: '      abcha     '
    }
}

var response = {
    render: function(...args){}

}

describe('login', () => {
    test("pass", () => {
        expect(testFunc.LoginCheck(success, Accs)).toBe(0)
    })
    test("fail", () => {
        expect(testFunc.LoginCheck(fail, Accs)).toBe(undefined)
    })
})

describe('registerUsername', () => {
    test("pass", () => {
        expect(testFunc.UserNameCheck(success, response, Accs)).toBe(0)
    })
    test("Already Exists", () => {
        expect(testFunc.UserNameCheck(fail, response, Accs)).toBe(1)
    })
    test("Too Short", () => {
        expect(testFunc.UserNameCheck(fail2, response, Accs)).toBe(2)
    })
    test("Too Long", () => {
        expect(testFunc.UserNameCheck(fail3, response, Accs)).toBe(2)
    })
    test("Included Special character", () => {
        expect(testFunc.UserNameCheck(failSpeChar, response, Accs)).toBe(1)
    })
    test("Included Space", ()=> {
        expect(testFunc.UserNameCheck(failSpace, response, Accs)).toBe(1)
    })
})

describe('registerPassword', () => {
    test('pass', () => {
        expect(testFunc.PasswordCheck(success, response)).toBe(0)
    })
    test('Not Matching', () => {
        expect(testFunc.PasswordCheck(fail, response)).toBe(1)
    })
    test('Not 5 Chars', () => {
        expect(testFunc.PasswordCheck(fail2, response)).toBe(2)
    })
})