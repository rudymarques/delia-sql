pipeline {
  agent any
  options { ansiColor('xterm'); timestamps() }
  tools { nodejs 'node18-lts' }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install CLI tools') {
      steps {
        sh 'npm install -g newman newman-reporter-htmlextra'
      }
    }

    stage('API Tests') {
      steps {
        sh '''
          mkdir -p reports/api
          newman run tests/api/Delia_API.postman_collection.json \
            --reporters cli,htmlextra \
            --reporter-htmlextra-export reports/api/index.html
        '''
      }
    }

    stage('UI Tests (Playwright)') {
      steps {
        dir('tests/ui') {
          sh '''
            npm install
            npx playwright install chromium
            npx playwright test --reporter=html
          '''
        }
      }
    }
  }

  post {
    always {
      publishHTML(target: [
        reportDir: 'reports/api',
        reportFiles: 'index.html',
        reportName: 'API Test Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])
      publishHTML(target: [
        reportDir: 'tests/ui/playwright-report',
        reportFiles: 'index.html',
        reportName: 'UI Test Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])
    }
  }
}
