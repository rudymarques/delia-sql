pipeline {
  agent any
  options { ansiColor('xterm'); timestamps() }
  tools { nodejs 'node18-lts' } // <-- doit égaler le Name que tu as mis

  stages {
    stage('Checkout') { 
      steps { 
        checkout scm 
      } 
    }
    stage('Sanity Check') {
      steps {
        sh 'node -v && npm -v'
        echo '✅ Jenkins connecté et Node OK.'
      }
    }
  }
}
