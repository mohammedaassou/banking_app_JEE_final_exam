# E-Banking App - Spring Backend (Groupe 4)

Ce projet consiste en la création d'une application backend pour un système de gestion bancaire en utilisant Spring Boot. 
Il a été réalisé dans le cadre d'un projet académique par les membres suivantes :

- **AGOUMI Chaima**
- **BACHRI Fatima Ezzahra**
- **BOUANGA Nelle Kelly**
- **BIZALINE Jalila**
- **ER-RAGRAGY Boutaina**
- **FEKNI Safaa**

## Fonctionnalités principales

1. **Création du projet Spring Boot**
   - Initialisation d'un projet Spring Boot configuré avec Maven.

2. **Entités JPA**
   - Développement des entités suivantes :
     - `Customer`
     - `BankAccount`
     - `SavingAccount`
     - `CurrentAccount`
     - `AccountOperation`

3. **Interfaces JPA Repository**
   - Création des interfaces JPA Repository en utilisant Spring Data pour permettre l'interaction avec la base de données.

4. **Couche DAO**
   - Tests de la couche Data Access Object (DAO) pour valider les opérations sur la base de données.

5. **Couche Service et DTOs**
   - Développement de la couche service pour gérer la logique métier.
   - Implémentation des DTOs (Data Transfer Objects) pour transférer les données entre les différentes couches de l'application.

6. **RestController**
   - Création de contrôleurs RESTful pour exposer les fonctionnalités via des web services RESTful.

7. **Tests des Web Services RESTful**
   - Validation et test des API via des outils comme Postman ou Swagger.

## Prérequis

- **JDK** : Version 17 ou supérieure
- **Maven** : Version 3.8 ou supérieure
- **Base de données** : MySQL
- **IDE** : IntelliJ IDEA

## Configuration de Swagger

Pour documenter et tester les APIs, Swagger est intégré en utilisant la dépendance suivante :

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.1.0</version>
</dependency>
```

### Accès à Swagger UI

Après avoir démarré le serveur, Swagger UI sera accessible à l'URL suivante :
[http://localhost:8081/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Installation et Lancement

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Chaaamah/E-Banking-App-Spring-Backend-G4.git
   ```
2. Importez le projet dans votre IDE préféré.
3. Configurez le fichier `application.properties` avec les paramètres de votre base de données.
4. Compilez et démarrez l'application :
   ```bash
   mvn spring-boot:run
   ```

## Structure du projet

- `src/main/java`
  - Contient le code source principal (entités, services, contrôleurs, etc.)
- `src/main/resources`
  - Contient les fichiers de configuration et les scripts SQL si nécessaires.
- `src/test/java`
  - Contient les tests unitaires et d'intégration.
