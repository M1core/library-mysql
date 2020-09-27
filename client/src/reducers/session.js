const State = {
    showLogIn: false,
    showSignUp: false,
    user: { // мы вложили в user вместо строки, объект
        name: 'null',
        role: 'guest',
        token: '0',
    },
}

const session = (state = State, action) => {
    switch (action.type) {
        case 'LOG_IN':
            action.payload.remember === "on" ? document.cookie = encodeURIComponent("token") + "=" 
            + encodeURIComponent(action.payload.token) : localStorage.setItem("token", action.payload.token)
            return { ...state, user: action.payload }
        case 'LOG_OUT':
            document.cookie = encodeURIComponent("token") + "=" + encodeURIComponent("0")
            localStorage.setItem("token", "0")
            return { ...state, user: action.payload }
        case 'LOG_IN_FORM':
            return { ...state, showLogIn: false, showSignUp: false }
        default:
            return state
    }
}

export default session