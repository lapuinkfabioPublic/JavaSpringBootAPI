package com.minibank.api.service;

import com.minibank.api.dto.ContaRequest;
import com.minibank.api.model.Conta;
import com.minibank.api.repository.ContaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContaService {

    private final ContaRepository repository;

    @Transactional
    public Conta criar(ContaRequest req) {
        if (repository.existsByNumero(req.numero())) {
            throw new IllegalArgumentException("Conta já existe: " + req.numero());
        }
        Conta conta = Conta.builder()
                .numero(req.numero())
                .titular(req.titular())
                .tipo(req.tipo())
                .saldo(req.saldoInicial())
                .build();
        return repository.save(conta);
    }

    public Conta buscarPorNumero(String numero) {
        return repository.findByNumero(numero)
                .orElseThrow(() -> new IllegalArgumentException("Conta não encontrada"));
    }

    public List<Conta> listar() {
        return repository.findAll();
    }

    @Transactional
    public Conta depositar(String numero, BigDecimal valor) {
        if (valor.signum() <= 0) throw new IllegalArgumentException("Valor inválido");
        Conta conta = buscarPorNumero(numero);
        conta.setSaldo(conta.getSaldo().add(valor));
        return repository.save(conta);
    }
}
