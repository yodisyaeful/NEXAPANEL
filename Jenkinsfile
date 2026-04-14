pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/username/project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright Test') {
            steps {
                bat 'npx playwright test'
            }
        }

        stage('Check Files') {
            steps {
                bat 'dir /s'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
        }
    }
}