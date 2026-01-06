package ma.mundia.banque_digital_backend.exception;

public class BankAccountNotFoundException extends Exception {
    public BankAccountNotFoundException(String accountNotFound) {
        super(accountNotFound);
    }
}
