package com.minibank.api.dto;

import com.minibank.api.model.Conta;
import com.minibank.api.model.TipoConta;
import java.math.BigDecimal;

public record ContaResponse(Long id, String numero, String titular,
                            TipoConta tipo, BigDecimal saldo) {
    public static ContaResponse from(Conta c) {
        return new ContaResponse(c.getId(), c.getNumero(), c.getTitular(),
                                 c.getTipo(), c.getSaldo());
    }
}
