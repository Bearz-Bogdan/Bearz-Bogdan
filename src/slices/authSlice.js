import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null, //verificam daca exista un user logat in local storage 
                                                                                                      //daca da il setam ca user logat si daca nu setam null

}

const authSlice = createSlice({ 
    name: 'auth',  
    initialState, 
    reducers: { 
        setCredentials(state, action) { //action.payload = user-ul logat
            state.userInfo = action.payload; //setam user-ul in state
            localStorage.setItem('userInfo', JSON.stringify(action.payload)); //setam user-ul in local storage
        },
        logout(state, action) {
            state.userInfo = null;
            localStorage.clear();
        }
    }
});

export const {setCredentials, logout} = authSlice.actions;

export default authSlice.reducer;