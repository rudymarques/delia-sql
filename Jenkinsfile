pipeline {
  agent any
  options { ansiColor('xterm'); timestamps() }
  tools { nodejs 'node18-lts' } // Doit correspondre au nom configuré dans Jenkins

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install Newman') {
      steps {
        sh 'npm install -g newman newman-reporter-htmlextra'
      }
    }

    stage('Run API Tests') {
      steps {
        sh '''
          mkdir -p reports
          newman run tests/api/Delia_API.postman_collection.json \
            --reporters cli,htmlextra \
            --reporter-htmlextra-export reports/api_report.html
        '''
      }
    }

    stage('Publish Report') {
      steps {
        publishHTML(target: [
          reportDir: 'reports',
          reportFiles: 'api_report.html',
          reportName: 'API Test Report',
          keepAll: true
        ])
      }
    }
  }
}
