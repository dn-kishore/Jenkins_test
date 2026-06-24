pipeline {
    agent any

    environment {
        FIREBASE_TOKEN = credentials('firebase-token')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing client dependencies...'
                dir('client') {
                    sh 'npm install'
                }
                echo 'Installing server dependencies...'
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Client') {
            steps {
                echo 'Building client for production...'
                dir('client') {
                    sh 'VITE_API_URL=/api npm run build'
                }
            }
        }

        stage('Deploy to Firebase') {
            when {
                branch 'master'
            }
            steps {
                echo 'Deploying hosting and functions to Firebase...'
                sh 'firebase deploy --only hosting,functions --token $FIREBASE_TOKEN'
            }
        }
    }
}
