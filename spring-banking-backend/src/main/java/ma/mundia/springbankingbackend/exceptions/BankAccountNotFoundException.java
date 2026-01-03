package ma.mundia.springbankingbackend.exceptions;
public class BankAccountNotFoundException extends Exception {
    public BankAccountNotFoundException(String message) {
        super(message);
    }
}
