def label = "worker-${UUID.randomUUID()}"

podTemplate(label: label, containers: [
        containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'kubectl', image: 'roffe/kubectl', command: 'cat', ttyEnabled: true),
        containerTemplate(name: 'node', image: 'timbru31/java-node', command: 'cat', ttyEnabled: true)
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
                                "env_name=${getEnvName(env.BRANCH_NAME)}",
                                "domain_name=${getDomainName(env.BRANCH_NAME)}",
                                "requests_cpu=${getRequestsCPU(env.BRANCH_NAME)}",
                                "requests_memory=${getRequestsMemory(env.BRANCH_NAME)}",
                                "limits_cpu=${getLimitsCPU(env.BRANCH_NAME)}",
                                "limits_memory=${getLimitsMemory(env.BRANCH_NAME)}"

                        ]) {


                stage('Build and push to docker registry') {
                    withCredentials([usernamePassword(credentialsId: 'DockerHubCredentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        buildDockerImageAndPush(USERNAME, PASSWORD)
                        deleteImages()
                    }
                }

                stage('Deploy on k8s') {
                    runApp()
                }

                // stage('SonarQube analysis') {
                //     withSonarQubeEnv('SonarQubeServer') {
                //         container('node') {
                //             sh 'npm install sonar-scanner --save-dev -f'
                //             sh 'chmod +x node_modules/sonar-scanner/bin/sonar-scanner'
                //             sh 'npm run sonar-scanner'
                //         }
                //     }
                //     timeout(time: 1, unit: 'MINUTES') {
                //         def qg = waitForQualityGate()
                //         if (qg.status != 'OK') {
                //             error "Pipeline aborted due to quality gate failure: ${qg.status}"
                //         }
                //     }
                // }
                        }
                } catch (exc) {
            currentBuild.result = 'FAILURE'
            throw exc
                } finally {
            if (currentBuild.result == 'FAILURE') {
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
String getDomainName(String branchName) {
    String rootDomain = 'zerofiltre.tech'
    if ( branchName == 'main' ) {
        return rootDomain
    }
    return (branchName == 'ready') ? 'uat.' + rootDomain : 'dev.' + rootDomain
}

String getTag(String buildNumber, String branchName) {
    String tag = 'imzerofiltre/zerofiltretech-blog-front:' + UUID.randomUUID().toString() + '-' + buildNumber
    if (branchName == 'main') {
        return tag + '-stable'
    }
    return tag + '-unstable'
}

def deleteImages() {
    container('docker') {
        def images = sh(returnStdout: true, script: 'docker images -q -f "label=autodelete=true"')

        if (images) {
            sh(''' docker rmi -f $(docker images -q -f "label=autodelete=true") ''')
        }
    }
}

def buildDockerImageAndPush(dockerUser, dockerPassword) {
    container('docker') {
        sh("""
                docker build -f .docker/Dockerfile -t ${api_image_tag} --pull --target prod .
                echo "Image build complete"
                docker login -u $dockerUser -p $dockerPassword
                docker push ${api_image_tag}
                echo "Image push complete"
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
                  echo "domain name to delpoy on:" ${domain_name}
                  envsubst < microservices.yaml | kubectl apply -f -
               """
        }
        sh """
                kubectl set image deployment/zerofiltretech-blog-front-${env_name} zerofiltretech-blog-front-${env_name}=${api_image_tag} -n zerofiltretech-${env_name} --record
                kubectl get deploy zerofiltretech-blog-front-${env_name} -o yaml -n zerofiltretech-${env_name}
                if ! kubectl rollout status -w deployment/zerofiltretech-blog-front-${env_name} -n zerofiltretech-${env_name}; then
                    kubectl rollout undo deployment.v1.apps/zerofiltretech-blog-front-${env_name} -n zerofiltretech-${env_name}
                    kubectl rollout status deployment/zerofiltretech-blog-front-${env_name} -n zerofiltretech-${env_name}
                    exit 1
                fi
            """
    }
}

String getRequestsCPU(String branchName) {
    if (branchName == 'main') {
        return '0.5'
    } else {
        return '0.2'
    }
}

String getRequestsMemory(String branchName) {
    if (branchName == 'main') {
        return '0.5Gi'
    } else {
        return '0.5Gi'
    }
}

String getLimitsCPU(String branchName) {
    if (branchName == 'main') {
        return '0.5'
    } else {
        return '0.2'
    }
}

String getLimitsMemory(String branchName) {
    if (branchName == 'main') {
        return '1Gi'
    } else {
        return '1Gi'
    }
}

def sendEmail() {
    String url = env.BUILD_URL.replace('http://jenkins:8080', 'https://jenkins.zerofiltre.tech')
    mail(
            to: env.COMMIT_AUTHOR_EMAIL,
            subject: env.COMMIT_AUTHOR_NAME + " build #${env.BUILD_NUMBER} is a ${currentBuild.currentResult} - (${currentBuild.fullDisplayName})",
            body: "Check console output at: ${url}/console" + '\n')
}
