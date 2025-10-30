pipeline {
  agent any
  options { ansiColor('xterm'); timestamps() }
  // Le nom doit correspondre à l'outil Node configuré dans Jenkins > Manage Jenkins > Tools
  tools { nodejs 'node18-lts' }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    // ===== API TESTS (POSTMAN/NEWMAN) =====
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

    stage('Publish API Report') {
      steps {
        publishHTML(target: [
          reportDir: 'reports',
          reportFiles: 'api_report.html',
          reportName: 'API Test Report',
          keepAll: true
        ])
      }
    }

    // ===== UI TESTS (PLAYWRIGHT) =====
    stage('UI Tests (Playwright)') {
      steps {
        sh '''
          cd tests/ui
          npm ci || npm install
          npx playwright install chromium
          npx playwright test --reporter=html
        '''
      }
    }

    stage('Publish UI Report') {
      steps {
        publishHTML(target: [
          reportDir: 'tests/ui/playwright-report',
          reportFiles: 'index.html',
          reportName: 'UI Test Report',
          keepAll: true
        ])
      }
    }
  }
}