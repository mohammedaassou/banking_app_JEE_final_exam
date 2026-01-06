package ma.mundia.banque_digital_backend.repositories;

import ma.mundia.banque_digital_backend.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("select c from Customer c where c.name like :keyword")
    List<Customer> searchCustomer(@Param(value="keyword") String keyword);
}
