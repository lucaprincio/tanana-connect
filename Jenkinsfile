pipeline {
    agent any

    stages {
        stage('Préparation') {
            steps {
                echo 'Nettoyage de l\'espace de travail...'
                deleteDir()
                checkout scm
            }
        }

        stage('Compilation') {
            steps {
                echo 'Compilation du projet Java...'
                // Si tu utilises Maven :
                sh './mvnw clean compile'
                // Ou si c'est du Java pur avec javac :
                // sh 'javac src/*.java -d bin/'
            }
        }

        stage('Tests') {
            steps {
                echo 'Exécution des tests unitaires...'
                sh './mvnw test'
            }
        }

        stage('Déploiement (Simulation)') {
            steps {
                echo 'Prêt pour la soutenance !'
                echo 'L\'application est compilée et testée avec succès.'
            }
        }
    }

    post {
        always {
            echo 'Fin du cycle d\'automatisation.'
        }
        failure {
            echo 'Alerte : Le build a échoué. Vérifie ton code !'
        }
    }
}
