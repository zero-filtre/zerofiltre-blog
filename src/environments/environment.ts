
let env = {}

if(typeof localStorage !== 'undefined'){
    env = JSON.parse(localStorage.getItem("env-value") || '')
}



export const environment:any = env;