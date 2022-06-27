import envTemplate from 'src/environments/environment.template';

let env:any = {}

if (typeof localStorage !== 'undefined') {
    env = JSON.parse(localStorage.getItem("env-value") || '{"apiBaseUrl":"https://blog-api-dev.zerofiltre.tech"}')
}
else {

    for (const key in envTemplate) {
        env[key] = process.env[(<any>envTemplate)[key]]
    }
}


export const environment: any = env;