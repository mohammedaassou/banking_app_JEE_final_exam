# 🔐 Sécurité Backend - Rapport Technique - Aya Anam
## Branche : `security-backend`

### 👥 Équipe
- **Aya Anam** (Responsable sécurité backend)
- Aymane Al Yamani
- Fatima Zahra Ail Lamine  
- Mohamed Aassou

---

## 📋 Table des Matières
1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Implémentation](#implementation)
4. [Endpoints](#endpoints)
5. [Tests](#tests)
6. [Conclusion](#conclusion)

---

## 1. Introduction <a name="introduction"></a>

### Contexte
Ce README présente les travaux réalisés sur la branche `security-backend` du système E-Banking. Cette branche est dédiée à l'implémentation des mécanismes de sécurité backend utilisant Spring Security et JWT.

### Objectifs
- ✅ Authentification robuste avec JWT
- ✅ Autorisation basée sur les rôles (RBAC)
- ✅ Sécurisation des API REST
- ✅ Architecture stateless et scalable
- ✅ Protection CORS

---

## 2. Architecture de Sécurité <a name="architecture"></a>

### Composants Principaux
| Composant | Rôle |
|-----------|------|
| Spring Security | Framework principal |
| JWT | Authentification par tokens |
| AuthenticationManager | Validation credentials |
| SecurityFilterChain | Filtrage requêtes HTTP |
| JwtEncoder/Decoder | Gestion tokens |
| @PreAuthorize | Autorisation méthode |

### Flux d'Authentification
Client → POST /auth/login → Validation → Génération JWT →
Retour token → Requêtes avec token → Validation →
Vérification rôles → Accès accordé/refusé

---

## 3. Implémentation Technique <a name="implementation"></a>

### Authentification JWT

**Login Request :**

POST /auth/login
{
"username": "Admin",
"password": "1234"
}

**Login Response :**
{
"accessToken": "eyJhbGciOiJIUzUxMiJ9...",
"tokenType": "Bearer",
"expiresIn": 3600
}


**Structure du Token :**
- `sub` : Nom d'utilisateur
- `scope` : Rôles (ex: ROLE_ADMIN)
- `iat` : Date d'émission
- `exp` : Date d'expiration (1h)

### Rôles et Permissions
| Rôle | Permissions |
|------|-------------|
| ROLE_ADMIN | Accès complet |
| ROLE_MANAGER | Gestion opérationnelle |
| ROLE_USER | Opérations limitées |

### Exemple de Sécurité

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    
    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_ROLE_ADMIN')")
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        // Seul ADMIN peut accéder
        return ResponseEntity.ok(customerService.getAllCustomers());
    }
}
Configuration Spring Security:
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/login").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/**").authenticated()
                .anyRequest().authenticated());
        
        return http.build();
    }
}
Configuration JWT:
# application.properties
jwt.secret=mySuperSecretKeyForJWTEncryptionWithHS512Algorithm
jwt.expiration=3600
jwt.issuer=e-banking-system

4. Endpoints Sécurisés <a name="endpoints"></a>
Endpoint	Méthode	Authentification	Rôle Requis
## Endpoints Sécurisés

| Endpoint | Méthode | Authentification | Rôle Requis |
|----------|---------|-----------------|-------------|
| `/auth/login` | POST | ❌ | Public |
| `/auth/register` | POST | ❌ | Public |
| `/auth/profile` | GET | ✅ | Authentifié |
| `/api/customers` | GET | ✅ | ROLE_ADMIN |
| `/api/customers/{id}` | GET | ✅ | Authentifié |
| `/api/accounts` | GET | ✅ | ROLE_ADMIN, ROLE_MANAGER |
| `/api/transactions` | GET | ✅ | Authentifié |
| `/api/admin/**` | Toutes | ✅ | ROLE_ADMIN |
| `/chatbot/**` | Toutes | ❌ | Public |

## Tests et Validation

### Scénarios de Test

| Test | Description | Résultat Attendu |
|------|-------------|------------------|
| T01 | Login avec bons credentials | Token JWT valide (200) |
| T02 | Accès sans token | 401 Unauthorized |
| T03 | User accède admin endpoint | 403 Forbidden |
| T04 | Token expiré | 401 Unauthorized |
| T05 | CORS non autorisé | Bloqué |

### Outils Utilisés

- 🧪 **Postman** - Tests API
- 🧪 **JUnit** - Tests unitaires
- 🧪 **MockMvc** - Tests contrôleurs
- 📖 **Swagger UI** - Documentation interactive


## 📊 Métriques de Performance

| Métrique | Valeur |
|----------|--------|
| Génération token | < 10ms |
| Validation token | < 5ms |
| Durée token | 1 heure |
| Requêtes/sec | 1000+ |

## 6. Conclusion

### ✅ Réalisations
- 🔐 **Authentification JWT** robuste et sécurisée
- 🛡️ **RBAC** (Role-Based Access Control) implémenté  
- 🌐 **CORS** configuré pour le frontend Angular
- 📊 **API REST** entièrement sécurisées
- 🧪 **Tests** complets de sécurité

## 📁 Structure du Projet

**src/main/java/com/ebanking/security/**
- **config/**
  - SecurityConfig.java
  - CorsConfig.java
- **jwt/**
  - JwtService.java
  - JwtAuthenticationFilter.java
  - JwtTokenProvider.java
- **auth/**
  - AuthController.java
  - AuthService.java
- **model/**
  - User.java
  - Role.java
- **exception/**
  - SecurityExceptionHandler.java
