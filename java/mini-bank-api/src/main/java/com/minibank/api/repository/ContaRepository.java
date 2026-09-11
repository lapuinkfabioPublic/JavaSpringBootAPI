package com.minibank.api.repository;

import com.minibank.api.model.Conta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ContaRepository extends JpaRepository<Conta, Long> {
    Optional<Conta> findByNumero(String numero);
    boolean existsByNumero(String numero);
}
