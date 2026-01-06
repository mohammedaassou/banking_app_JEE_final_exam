package ma.mundia.banque_digital_backend.dtos;

import lombok.Data;

@Data
public class SavingAccountRequest {
    private double initialBalance;
    private double interestRate;
}
