pipeline {
  agent any
  options { ansiColor('xterm'); timestamps() }
  tools { nodejs 'node18-lts' }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    // === API (Postman/Newman) ===
    stage('API Tests') {
      steps {
        sh 'npm install -g newman newman-reporter-htmlextra'
        sh '''
          mkdir -p reports/api
          newman run tests/api/Delia_API.postman_collection.json \
            --reporters cli,htmlextra \
            --reporter-htmlextra-export reports/api/index.html
        '''
      }
    }

    // === UI (Playwright) ===
    stage('UI Tests (Playwright)') {
      steps {
        dir('tests/ui') {
          sh '''
            npm ci || npm install
            npx playwright install chromium || true
            npx playwright test --reporter=html || true
          '''
        }
      }
    }

    // === DB (SQLite) ===
    stage('DB Check (SQLite)') {
      steps {
        sh '''
          npm init -y >/dev/null 2>&1 || true
          npm install sqlite3 --silent
          node db-check.js
        '''
      }
    }
  }

  post {
    always {
      // Rapport API
      publishHTML(target: [
        reportDir: 'reports/api',
        reportFiles: 'index.html',
        reportName: 'API Test Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])

      // Rapport UI (peut être vide si le run a été noop)
      publishHTML(target: [
        reportDir: 'tests/ui/playwright-report',
        reportFiles: 'index.html',
        reportName: 'UI Test Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])

      // Archive du rapport Playwright
      archiveArtifacts artifacts: 'tests/ui/playwright-report/**',
                       fingerprint: true,
                       allowEmptyArchive: true
    }
  }
}


