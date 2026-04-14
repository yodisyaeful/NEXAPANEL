pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/username/project.git'
            }
        }

        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Automation Test') {
            steps {
                bat 'npm test'
            }
        }
    }

    post {
        always {
            junit '**/reports/*.xml'
        }
    }
}