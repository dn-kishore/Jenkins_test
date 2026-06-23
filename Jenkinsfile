pipeline {
    agent any

    environment {
        FIREBASE_TOKEN = credentials('firebase-token')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Frontend') {
            steps {
                dir('client') {
                    sh 'npm ci'
                }
            }
        }

        stage('Build') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Firebase') {
            when {
                allOf {
                    branch 'master'
                    not { changeRequest() }
                }
            }

            steps {
                dir('client') {
                    sh '''
                    npx firebase deploy \
                    --only hosting \
                    --token $FIREBASE_TOKEN
                    '''
                }
            }
        }
    }
}
