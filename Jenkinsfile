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

        stage('Install Dependencies') {
            steps {
                dir('client') {
                    sh 'npm install'
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

        stage('Deploy') {
            steps {
                dir('client') {
                    sh '''
                    firebase deploy \
                    --only hosting \
                    --token $FIREBASE_TOKEN
                    '''
                }
            }
        }
    }
}
