package ma.mundia.banque_digital_backend;

import ma.mundia.banque_digital_backend.dtos.BankAccountDTO;
import ma.mundia.banque_digital_backend.dtos.CurrentBankAccountDTO;
import ma.mundia.banque_digital_backend.dtos.CustomerDTO;
import ma.mundia.banque_digital_backend.dtos.SavingBankAccountDTO;
import ma.mundia.banque_digital_backend.enums.AccountStatus;
import ma.mundia.banque_digital_backend.enums.OperationType;
import ma.mundia.banque_digital_backend.exception.CustomerNotFoundException;
import ma.mundia.banque_digital_backend.repositories.AccountOperationRepository;
import ma.mundia.banque_digital_backend.repositories.BankAccountRepository;
import ma.mundia.banque_digital_backend.repositories.CustomerRepository;
import ma.mundia.banque_digital_backend.services.BankAccountService;
import ma.mundia.banque_digital_backend.entities.AccountOperation;
import ma.mundia.banque_digital_backend.entities.CurrentAccount;
import ma.mundia.banque_digital_backend.entities.Customer;
import ma.mundia.banque_digital_backend.entities.SavingAccount;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@SpringBootApplication
public class BanqueDigitalBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BanqueDigitalBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(BankAccountService bankAccountService) {
        return args -> {
            Stream.of("Fati", "Chaima", "Jalila", "Kelly", "Boutaina").forEach(name ->
                    bankAccountService.saveCustomerDTO(CustomerDTO.builder()
                            .name(name)
                            .email(name+"@gmail.com")
                            .build()
                    )
            );
            // Create bank accounts
            bankAccountService.listCustomers().forEach(customer -> {
                try {
                    bankAccountService.saveCurrentAccountDTO(Math.random()*9000, 500, customer.getId());
                    bankAccountService.saveSavingAccountDTO(Math.random()*9000, 5.5, customer.getId());

                } catch (CustomerNotFoundException e) {
                    e.printStackTrace();
                }
            });

            List<BankAccountDTO> bankAccounts = bankAccountService.listBankAccounts();
            for (BankAccountDTO bankAccount : bankAccounts) {
                for (int i = 0; i < 5; i++) {
                    String accountId;
                    if(bankAccount instanceof CurrentBankAccountDTO) {
                        accountId = ((CurrentBankAccountDTO) bankAccount).getId();
                    } else {
                        accountId = ((SavingBankAccountDTO) bankAccount).getId();
                    }
                    bankAccountService.credit(accountId, Math.random()*6000, "Initial credit");
                    bankAccountService.debit(accountId, Math.random()*600, "Initial debit");
                }
            }
        };
    }

//    @Bean
    CommandLineRunner start(CustomerRepository customerRepository, AccountOperationRepository accountOperationRepository, BankAccountRepository bankAccountRepository) {
        return args -> {
            // Create customers
            Stream.of("Fati", "Chama", "Jalila", "Kelly", "Boutaina").forEach(name ->
                    customerRepository.save(Customer.builder()
                    .name(name)
                    .email(name+"@gmail.com")
                    .build()
            ));

            //Create bank accounts
            customerRepository.findAll().forEach(customer -> {
                CurrentAccount currentAccount = CurrentAccount.builder()
                        .id(UUID.randomUUID().toString())
                        .customer(customer)
                        .balance(Math.random()*9000)
                        .creationDate(new Date())
                        .status(AccountStatus.CREATED)
                        .overdraft(500)
                        .build();
                bankAccountRepository.save(currentAccount);

                bankAccountRepository.save(SavingAccount.builder()
                        .id(UUID.randomUUID().toString())
                        .customer(customer)
                        .balance(Math.random()*9000)
                        .creationDate(new Date())
                        .status(AccountStatus.CREATED)
                        .rate(5.5)
                        .build()
                );
            });

            // Create account operations
            bankAccountRepository.findAll().forEach(bankAccount -> {
                for (int i = 0; i < 5; i++) {
                    accountOperationRepository.save(AccountOperation.builder()
                            .amount(Math.random()*6000)
                            .operationDate(new Date())
                            .operationType(Math.random() > 0.5 ? OperationType.DEBIT : OperationType.CREDIT)
                            .bankAccount(bankAccount)
                            .build()
                    );
                }
            });

        };
    }
}