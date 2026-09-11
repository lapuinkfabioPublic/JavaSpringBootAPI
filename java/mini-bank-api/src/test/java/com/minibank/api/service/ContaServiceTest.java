package com.minibank.api.service;

import com.minibank.api.dto.ContaRequest;
import com.minibank.api.model.*;
import com.minibank.api.repository.ContaRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContaServiceTest {

    @Mock ContaRepository repository;
    @InjectMocks ContaService service;

    @Test
    void deveCriarContaComSucesso() {
        var req = new ContaRequest("12345", "João", TipoConta.CORRENTE,
                                   new BigDecimal("100.00"));
        when(repository.existsByNumero("12345")).thenReturn(false);
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        var conta = service.criar(req);

        assertThat(conta.getNumero()).isEqualTo("12345");
        assertThat(conta.getSaldo()).isEqualByComparingTo("100.00");
        verify(repository).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoContaDuplicada() {
        var req = new ContaRequest("12345", "João", TipoConta.CORRENTE,
                                   BigDecimal.ZERO);
        when(repository.existsByNumero("12345")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("já existe");
    }

    @Test
    void deveDepositarValor() {
        var conta = Conta.builder().numero("1").saldo(new BigDecimal("50")).build();
        when(repository.findByNumero("1")).thenReturn(Optional.of(conta));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        var result = service.depositar("1", new BigDecimal("25"));

        assertThat(result.getSaldo()).isEqualByComparingTo("75");
    }
}
