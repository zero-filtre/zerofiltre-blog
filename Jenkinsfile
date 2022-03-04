def label = "worker-${UUID.randomUUID().toString()}"

podTemplate(label: label, containers: [
        containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'kubectl', image: 'roffe/kubectl', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'node', image: 'node:12-alpine', command: 'cat', ttyEnabled: true)
],
        volumes: [
                hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
        ]) {

    node(label) {
        stage('Checkout') {
            checkout scm
        }

        withEnv(["api_image_tag=${getTag(env.BUILD_NUMBER, env.BRANCH_NAME)}",
                 "env_name=${getEnvName(env.BRANCH_NAME)}"

        ]) {

            stage('Build with test') {
                buildAndTest()
            }

            stage('Build and push to docker registry') {
                withCredentials([usernamePassword(credentialsId: 'DockerHubCredentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    buildDockerImageAndPush(USERNAME, PASSWORD)
                }
            }

            stage('Deploy on k8s') {
                runApp()
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
    String tag = "imzerofiltre/zerofiltretech-blog-front:" + buildNumber;
    if (branchName == 'main') {
        return tag + '-stable'
    }
    return tag + '-unstable'
}

def buildAndTest() {
    container('node') {
        sh """
            npm install -g @angular/cli
            npm install
            ng build --configuration=${env_name} && ng run zerofiltre-blog:server --configuration=${env_name}
        """
    }
}

def buildDockerImageAndPush(dockerUser, dockerPassword) {
    container('docker') {
        sh """
                docker build -f .docker/Dockerfile -t ${api_image_tag} --pull --no-cache .
                echo "Image build complete"
                docker login -u $dockerUser -p $dockerPassword
                docker push ${api_image_tag}
                echo "Image push complete"
         """
    }
}

def runApp() {
    container('kubectl') {
        dir('k8s') {
            sh """
                  echo "Branch:" ${env.BRANCH_NAME}
                  echo "env:" ${env_name}
                  kubectl apply -f microservice-${env_name}.yaml
               """
        }
        sh """
                kubectl set image deployment/zerofiltretech-blog-front-${env_name} zerofiltretech-blog-front-${env_name}=${api_image_tag} -n zerofiltretech-${env_name}
                if ! kubectl rollout status -w deployment/zerofiltretech-blog-front-${env_name} -n zerofiltretech-${env_name}; then
                    kubectl rollout undo deployment.v1.apps/zerofiltretech-blog-front-${env_name} -n zerofiltretech-${env_name}
                    kubectl rollout status deployment/zerofiltretech-blog-front-${env_name} -n zerofiltretech-${env_name}
                    exit 1
                fi
            """
    }
}