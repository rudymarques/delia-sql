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
            # installe Chromium + deps si besoin (idempotent)
            npx playwright install --with-deps chromium || true
            # génère le rapport HTML dans tests/ui/playwright-report
            npx playwright test --reporter=html || true
          '''
        }
      }
    }
  }

  post {
    always {
      // Rapport API (HTMLPublisher)
      publishHTML(target: [
        reportDir: 'reports/api',
        reportFiles: 'index.html',
        reportName: 'API Test Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])

      // Rapport UI (HTMLPublisher) - peut être vide si CSP / pas de rapport
      publishHTML(target: [
        reportDir: 'tests/ui/playwright-report',
        reportFiles: 'index.html',
        reportName: 'UI Test Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])

      // Archive complète du rapport Playwright (pour télécharger/ouvrir en local)
      archiveArtifacts artifacts: 'tests/ui/playwright-report/**',
                       fingerprint: true,
                       allowEmptyArchive: true
    }
  }
stage('DB Check (SQLite)') {
  steps {
    sh '''
      npm init -y >/dev/null 2>&1 || true
      npm install sqlite3 --silent
      node db-check.js
    '''
  }
}


