package ma.mundia.banque_digital_backend.web;

import ma.mundia.banque_digital_backend.dtos.*;
import ma.mundia.banque_digital_backend.exception.BalanceInsiffucientException;
import ma.mundia.banque_digital_backend.exception.BankAccountNotFoundException;
import ma.mundia.banque_digital_backend.exception.CustomerNotFoundException;
import ma.mundia.banque_digital_backend.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class BankAccountRestAPI {
    private BankAccountService bankAccountService;

    public BankAccountRestAPI(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    @GetMapping("/accounts/{id}")
    public BankAccountDTO getBankAccount(@PathVariable String id) throws BankAccountNotFoundException {
        return bankAccountService.getBankAccount(id);
    }

    @GetMapping("/accounts")
    public List<BankAccountDTO> listBankAccounts() {
        return bankAccountService.listBankAccounts();

    }
    @GetMapping("/accounts/{id}/operations")
    public List<AccountOperationDTO> getHistory(@PathVariable String id) {
        return bankAccountService.accountHistory(id);
    }

    @GetMapping("/accounts/{id}/pageOperations")
    public AccountHistoryDTO getAccountHistory(@PathVariable String id, @RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name="size", defaultValue = "5") int size) throws BankAccountNotFoundException {
        return bankAccountService.getAccountHistory(id, page, size);
    }

    //debit trasfere credit
    @PostMapping("/accounts/credit/{id}")
    public void credit(@PathVariable String id, @RequestParam double amount, @RequestParam String desc) throws BankAccountNotFoundException {
        bankAccountService.credit(id, amount, desc);
    }

    @PostMapping("/accounts/debit/{id}")
    public void debit(@PathVariable String id, @RequestParam double amount, @RequestParam String desc) throws BankAccountNotFoundException, BalanceInsiffucientException {
        bankAccountService.debit(id, amount, desc);
    }

    @PostMapping("/accounts/transfer")
    public void transfer(@RequestParam String from, @RequestParam String to, @RequestParam double amount) throws BankAccountNotFoundException, BalanceInsiffucientException {
        bankAccountService.transfer(from, to, amount);
    }

    @PostMapping("/customers/{customerId}/current-accounts")
    public CurrentBankAccountDTO saveCurrentBankAccount(
            @RequestBody CurrentAccountRequest request,
            @PathVariable Long customerId) throws CustomerNotFoundException {
        return bankAccountService.saveCurrentBankAccount(
                request.getInitialBalance(),
                request.getOverDraft(),
                customerId
        );
    }

    @PostMapping("/customers/{customerId}/saving-accounts")
    public SavingBankAccountDTO saveSavingBankAccount(
            @RequestBody SavingAccountRequest request,
            @PathVariable Long customerId) throws CustomerNotFoundException {
        return bankAccountService.saveSavingBankAccount(request.getInitialBalance(), request.getInterestRate(), customerId);
    }
    @GetMapping("/customers/{customerId}/accounts")
    public List<BankAccountDTO> getBankAccountsByCustomerId(@PathVariable Long customerId) {
        List<BankAccountDTO> bankAccountDTOS = bankAccountService.getBankAccountsByCustomerId(customerId);
        return bankAccountDTOS;
    }
}
