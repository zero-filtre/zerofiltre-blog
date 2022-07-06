import envTemplate from 'src/environments/environment.template';

let env: any = {}

try {
    env = JSON.parse(localStorage.getItem("env-value") || '{}')
}
catch {

    for (const key in envTemplate) {
        env[key] = process.env[(<any>envTemplate)[key]]
    }


}

export const environment: any = env;