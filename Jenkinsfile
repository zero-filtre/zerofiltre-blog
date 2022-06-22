def label = "worker-${UUID.randomUUID()}"

podTemplate(label: label, containers: [
        containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'kubectl', image: 'roffe/kubectl', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'node', image: 'node:12-alpine', command: 'cat', ttyEnabled: true)
],
        volumes: [
                hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
        ]) {
            node(label) {
                try {
                    stage('Checkout') {
                            scm_vars = checkout scm
                            env.GIT_COMMIT = scm_vars.GIT_COMMIT
                    }

                    withEnv(["api_image_tag=${getTag(env.BUILD_NUMBER, env.BRANCH_NAME)}",
                                "env_name=${getEnvName(env.BRANCH_NAME)}"

                        ]) {
                            // stage('Build with test') {
                            //     buildAndTest()
                            // }

                            stage('Build and push to docker registry') {
                                withCredentials([usernamePassword(credentialsId: 'DockerHubCredentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'), file(credentialsId: 'FrontEnv', variable: 'FRONTENV')]) {
                                    injectEnv(FRONTENV)
                                    buildDockerImageAndPush(USERNAME, PASSWORD)
                                }
                            }

                            stage('Deploy on k8s') {
                                runApp()
                            }
                    }
                } catch(exc) {
                    currentBuild.result = 'FAILURE'
                    throw exc
                } finally {
                    if(currentBuild.result=='FAILURE') {
                        script {
                            env.COMMIT_AUTHOR_NAME = sh(script: "git --no-pager show -s --format='%an' ${env.GIT_COMMIT}", returnStdout: true)
                            env.COMMIT_AUTHOR_EMAIL = sh(script: "git --no-pager show -s --format='%ae' ${env.GIT_COMMIT}", returnStdout: true)
                        }
                        // deleteImageOnFail()
                        sendEmail()
                    }
                    deleteDir()
                    dir("${env.WORKSPACE}@tmp") {
                        deleteDir()
                    }
                    dir("${env.WORKSPACE}@script") {
                        deleteDir()
                    }
                    dir("${env.WORKSPACE}@script@tmp") {
                        deleteDir()
                    }
                }
            }
        }

String getEnvName(String branchName) {
    if ( branchName == 'main' ) {
        return 'prod'
    }
    return (branchName == 'ready') ? 'uat' : 'dev'
}

String getTag(String buildNumber, String branchName) {
    String tag = 'imzerofiltre/zerofiltretech-blog-front:' + buildNumber
    if (branchName == 'main') {
        return tag + '-stable'
    }
    return tag + '-unstable'
}

// def buildAndTest() {
//     container('node') {
//         sh """
//             npm install -g @angular/cli
//             npm install
//             ng build --configuration=${env_name} && ng run zerofiltre-blog:server --configuration=${env_name}
//         """
//     }
// }

def injectEnv(envFile){

    sh "cp $envFile src/environments/environment.ts"

}

def deleteImageOnFail(){
    container('docker') {
        def images = sh(returnStdout: true, script: "docker images 'imzerofiltre/zerofiltretech-blog-front' -a -q")

        if(images){
            sh("docker rmi $images")
        }
       
    }
}

def buildDockerImageAndPush(dockerUser, dockerPassword) {

    container('docker') {

        def images = sh(returnStdout: true, script: 'docker images -q -f "dangling=true" -f "label=autodelete=true"')

        // if(images){
        //     sh("docker rmi $images")
        // }
        
        sh("""
                docker build -f .docker/Dockerfile -t ${api_image_tag}  --target prod .
                echo "Image build complete"
                docker login -u $dockerUser -p $dockerPassword
                docker push ${api_image_tag}
                echo "Image push complete"
                docker rmi $images
         """)
    }
}

def runApp() {
    container('kubectl') {
        dir('k8s') {
            sh """
                  ls -la
                  echo "Branch:" ${env.BRANCH_NAME}
                  echo "env:" ${env_name}
                  envsubst < microservices.yaml | kubectl apply -f -
               """
        }
        sh """
                kubectl set image deployment/zerofiltretech-blog-front-${env_name} zerofiltretech-blog-front-${env_name}=${api_image_tag} -n zerofiltretech-${env_name}
                kubectl get deploy zerofiltretech-blog-front-${env_name} -o yaml -n zerofiltretech-${env_name}
                if ! kubectl rollout status -w deployment/zerofiltretech-blog-front-${env_name} -n zerofiltretech-${env_name}; then
                    kubectl rollout undo deployment.v1.apps/zerofiltretech-blog-front-${env_name} -n zerofiltretech-${env_name}
                    kubectl rollout status deployment/zerofiltretech-blog-front-${env_name} -n zerofiltretech-${env_name}
                    exit 1
                fi
            """
    }
}

def sendEmail() {
    String url = env.BUILD_URL.replace("http://jenkins:8080","https://jenkins.zerofiltre.tech")
    mail(
            to: env.COMMIT_AUTHOR_EMAIL,
            subject: env.COMMIT_AUTHOR_NAME + " build #${env.BUILD_NUMBER} is a ${currentBuild.currentResult} - (${currentBuild.fullDisplayName})",
            body: "Check console output at: ${url}/console" + "\n")
}