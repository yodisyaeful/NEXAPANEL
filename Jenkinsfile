pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github-token', url: 'https://github.com/yodisyaeful/NEXAPANEL.git'
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
                bat 'dir'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'results.xml'
        }
    }
}