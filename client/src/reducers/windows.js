const State = {
    showLogIn: null,
    showSignUp: null,
    showComments: null,
}

const windows = (state = State, action) => {
    console.log(action.payload)
    switch (action.type) {
        case 'CLOSE_WINDOW':
            switch (action.payload) {
                case "login": 
                return { ...state, showLogIn: false }
                case "signup": 
                return { ...state, showSignUp: false }
                case "comments": 
                return { ...state, showComments: false }
            }
        default:
            return state
    }
}

export default windows