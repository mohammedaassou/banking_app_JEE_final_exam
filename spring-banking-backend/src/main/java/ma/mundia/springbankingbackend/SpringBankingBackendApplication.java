package ma.mundia.springbankingbackend;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import ma.mundia.springbankingbackend.dtos.BankAccountDTO;
import ma.mundia.springbankingbackend.dtos.CurrentBankAccountDTO;
import ma.mundia.springbankingbackend.dtos.CustomerDTO;
import ma.mundia.springbankingbackend.dtos.SavingBankAccountDTO;
import ma.mundia.springbankingbackend.entities.AccountOperation;
import ma.mundia.springbankingbackend.entities.AppRole;
import ma.mundia.springbankingbackend.entities.AppUser;
import ma.mundia.springbankingbackend.entities.CurrentAccount;
import ma.mundia.springbankingbackend.entities.Customer;
import ma.mundia.springbankingbackend.entities.SavingAccount;
import ma.mundia.springbankingbackend.enums.AccountStatus;
import ma.mundia.springbankingbackend.enums.OperationType;
import ma.mundia.springbankingbackend.exceptions.CustomerNotFoundException;
import ma.mundia.springbankingbackend.repositories.AccountOperationRepository;
import ma.mundia.springbankingbackend.repositories.AppRoleRepository;
import ma.mundia.springbankingbackend.repositories.AppUserRepository;
import ma.mundia.springbankingbackend.repositories.BankAccountRepository;
import ma.mundia.springbankingbackend.repositories.CustomerRepository;
import ma.mundia.springbankingbackend.services.BankAccountService;

@SpringBootApplication
public class SpringBankingBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBankingBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initUsers(AppRoleRepository appRoleRepository,
                                AppUserRepository appUserRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            // Create roles if they don't exist
            AppRole adminRole = appRoleRepository.findByRoleName("ROLE_ADMIN")
                    .orElseGet(() -> appRoleRepository.save(new AppRole(null, "ROLE_ADMIN")));
            AppRole userRole = appRoleRepository.findByRoleName("ROLE_USER")
                    .orElseGet(() -> appRoleRepository.save(new AppRole(null, "ROLE_USER")));

            // Create admin user if doesn't exist
            if (!appUserRepository.existsByUsername("admin")) {
                AppUser admin = AppUser.builder()
                        .username("admin")
                        .email("admin@bank.com")
                        .password(passwordEncoder.encode("admin123"))
                        .firstName("Admin")
                        .lastName("User")
                        .enabled(true)
                        .roles(List.of(adminRole, userRole))
                        .build();
                appUserRepository.save(admin);
            }

            // Create test user if doesn't exist
            if (!appUserRepository.existsByUsername("user")) {
                AppUser user = AppUser.builder()
                        .username("user")
                        .email("user@bank.com")
                        .password(passwordEncoder.encode("user123"))
                        .firstName("Test")
                        .lastName("User")
                        .enabled(true)
                        .roles(List.of(userRole))
                        .build();
                appUserRepository.save(user);
            }
        };
    }

    @Bean
    CommandLineRunner commandLineRunner(BankAccountService bankAccountService){
        return args -> {
           Stream.of("Hassan","Imane","Mohamed").forEach(name->{
               CustomerDTO customer=new CustomerDTO();
               customer.setName(name);
               customer.setEmail(name+"@gmail.com");
               bankAccountService.saveCustomer(customer);
           });
           bankAccountService.listCustomers().forEach(customer->{
               try {
                   bankAccountService.saveCurrentBankAccount(Math.random()*90000,9000,customer.getId());
                   bankAccountService.saveSavingBankAccount(Math.random()*120000,5.5,customer.getId());

               } catch (CustomerNotFoundException e) {
                   e.printStackTrace();
               }
           });
            List<BankAccountDTO> bankAccounts = bankAccountService.bankAccountList();
            for (BankAccountDTO bankAccount:bankAccounts){
                for (int i = 0; i <10 ; i++) {
                    String accountId;
                    if(bankAccount instanceof SavingBankAccountDTO){
                        accountId=((SavingBankAccountDTO) bankAccount).getId();
                    } else{
                        accountId=((CurrentBankAccountDTO) bankAccount).getId();
                    }
                    bankAccountService.credit(accountId,10000+Math.random()*120000,"Credit");
                    bankAccountService.debit(accountId,1000+Math.random()*9000,"Debit");
                }
            }
        };
    }
    //@Bean
    CommandLineRunner start(CustomerRepository customerRepository,
                            BankAccountRepository bankAccountRepository,
                            AccountOperationRepository accountOperationRepository){
        return args -> {
            Stream.of("Hassan","yassmine","Aicha" , "Mohamed").forEach(name->{
                Customer customer=new Customer();
                customer.setName(name);
                customer.setEmail(name+"@gmail.com");
                customerRepository.save(customer);
            });
            customerRepository.findAll().forEach(cust->{
                CurrentAccount currentAccount=new CurrentAccount();
                currentAccount.setId(UUID.randomUUID().toString());
                currentAccount.setBalance(Math.random()*90000);
                currentAccount.setCreatedAt(new Date());
                currentAccount.setStatus(AccountStatus.CREATED);
                currentAccount.setCustomer(cust);
                currentAccount.setOverDraft(9000);
                bankAccountRepository.save(currentAccount);

                SavingAccount savingAccount=new SavingAccount();
                savingAccount.setId(UUID.randomUUID().toString());
                savingAccount.setBalance(Math.random()*90000);
                savingAccount.setCreatedAt(new Date());
                savingAccount.setStatus(AccountStatus.CREATED);
                savingAccount.setCustomer(cust);
                savingAccount.setInterestRate(5.5);
                bankAccountRepository.save(savingAccount);

            });
            bankAccountRepository.findAll().forEach(acc->{
                for (int i = 0; i <10 ; i++) {
                    AccountOperation accountOperation=new AccountOperation();
                    accountOperation.setOperationDate(new Date());
                    accountOperation.setAmount(Math.random()*12000);
                    accountOperation.setType(Math.random()>0.5? OperationType.DEBIT: OperationType.CREDIT);
                    accountOperation.setBankAccount(acc);
                    accountOperationRepository.save(accountOperation);
                }

            });
        };

    }


}
