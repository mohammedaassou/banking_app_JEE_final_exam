package ma.mundia.springbankingbackend.web;

import ma.mundia.springbankingbackend.services.OpenAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class OpenAiController {
    private final OpenAiService openAiService;

    public OpenAiController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @PostMapping("/ai/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String answer = openAiService.sendMessage(request.getMessage());
        ChatResponse resp = new ChatResponse();
        resp.setAnswer(answer);
        return ResponseEntity.ok(resp);
    }

    public static class ChatRequest {
        private String message;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ChatResponse {
        private String answer;

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
    }
}
