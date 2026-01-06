package ma.mundia.banque_digital_backend.exception;

public class BalanceInsiffucientException extends Exception {
    public BalanceInsiffucientException(String insufficientBalance) {
        super(insufficientBalance);
    }
}
