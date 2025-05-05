pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t rohith0702/forex-frontend:latest .'
            }
        }

        stage('Push to Docker Hub') {
    steps {
        sh '''
            echo "Rohith@0702" | docker login -u rohith0702 --password-stdin
            docker push rohith0702/forex-frontend:latest
        '''
    }
}
    }
}
