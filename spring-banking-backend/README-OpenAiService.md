# OpenAiService (Spring Boot)

Ce document décrit le service `OpenAiService` situé dans :

- `src/main/java/ma/mundia/springbankingbackend/services/OpenAiService.java`

## Objectif

`OpenAiService` encapsule un appel HTTP vers l’API OpenAI **Chat Completions** (`/v1/chat/completions`).

Il prend un message texte (user prompt) et renvoie la réponse textuelle extraite du champ :

- `choices[0].message.content`

Si la réponse n’est pas au format attendu (ou si le JSON ne peut pas être parsé), le service renvoie le **body brut**.

## Configuration

Le service lit sa configuration via des propriétés Spring :

- `openai.api.url` (par défaut `https://api.openai.com/v1/chat/completions`)
- `openai.api.key` (obligatoire)
- `openai.model` (par défaut `gpt-4o-mini`)

### Option A — via `application.properties`

Ajoutez (ou surchargez) dans `src/main/resources/application.properties` :

```properties
openai.api.url=https://api.openai.com/v1/chat/completions
openai.api.key=VOTRE_CLE_API
openai.model=gpt-4o-mini
```

### Option B — via variable d’environnement

Spring Boot supporte le *relaxed binding* :

- `openai.api.key` peut être fourni via la variable d’environnement `OPENAI_API_KEY`

Exemples :

PowerShell (Windows) :

```powershell
$env:OPENAI_API_KEY="VOTRE_CLE_API"
```

Bash :

```bash
export OPENAI_API_KEY="VOTRE_CLE_API"
```

Important : ne commitez jamais votre clé (Git).

## Fonctionnement (résumé)

1. Vérifie que la clé API est présente (sinon `IllegalStateException`).
2. Construit une requête JSON :
   - `model`: valeur de `openai.model`
   - `messages`: une liste contenant un seul message `{ role: "user", content: <message> }`
3. Envoie un `POST` vers `openai.api.url` avec le header :
   - `Authorization: Bearer <openai.api.key>`
4. Parse la réponse JSON et renvoie `choices[0].message.content`.

## Exemple d’utilisation (dans un Controller)

Exemple minimal (à adapter à votre projet) :

```java
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final OpenAiService openAiService;

    public AiController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody String prompt) {
        return openAiService.sendMessage(prompt);
    }
}
```

## Erreurs fréquentes

- **"OpenAI API key is missing"** : la propriété `openai.api.key` (ou `OPENAI_API_KEY`) n’est pas définie.
- **Réponse vide** : body HTTP vide (rare) ou problème côté API.
- **Réponse non parsée** : si le JSON ne correspond pas à la structure attendue, le service renvoie le body brut.

## Notes

- Le service utilise `RestTemplate` et `ObjectMapper`.
- Le parsing actuel ne gère que le premier choix (`choices[0]`).
- Le payload n’inclut pas de paramètres comme `temperature`, `max_tokens`, etc. (à ajouter si nécessaire).
