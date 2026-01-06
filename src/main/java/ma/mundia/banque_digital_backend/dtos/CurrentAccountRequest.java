package ma.mundia.banque_digital_backend.dtos;

import lombok.Data;

@Data
public class CurrentAccountRequest {
    private double initialBalance;
    private double overDraft;
}
