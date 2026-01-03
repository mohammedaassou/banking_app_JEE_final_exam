package ma.mundia.springbankingbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.mundia.springbankingbackend.entities.BankAccount;

public interface BankAccountRepository extends JpaRepository<BankAccount,String> {
}
