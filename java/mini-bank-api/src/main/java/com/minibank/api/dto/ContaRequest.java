package com.minibank.api.dto;

import com.minibank.api.model.TipoConta;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ContaRequest(
    @NotBlank String numero,
    @NotBlank String titular,
    @NotNull TipoConta tipo,
    @NotNull @DecimalMin("0.0") BigDecimal saldoInicial
) {}
