export const logIn = (user) => {
    console.log(user)
    return {
        type: "LOG_IN",
        payload: user
    };
};
export const logOut = () => {
    return {
        type: "LOG_OUT",
        payload: { login: null, email: null, role: 'guest' }
    };
};
export const signUp = (user) => {
    return {
        type: "SING_UP",
        payload: user
    };
};

export const close = (window) => {
    return {
        type: "CLOSE_WINDOW",
        payload: window
    };
}