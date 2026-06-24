pipeline {
    agent any

    environment {
        FIREBASE_TOKEN = credentials('firebase-token')
    }

    stages {

        stage('Install Frontend') {
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

        stage('Deploy Firebase') {
            when {
                branch 'master'
            }

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
