package com.minibank.api.controller;

import com.minibank.api.dto.ContaRequest;
import com.minibank.api.dto.ContaResponse;
import com.minibank.api.service.ContaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/contas")
@RequiredArgsConstructor
public class ContaController {

    private final ContaService service;

    @PostMapping
    public ResponseEntity<ContaResponse> criar(@Valid @RequestBody ContaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ContaResponse.from(service.criar(req)));
    }

    @GetMapping
    public List<ContaResponse> listar() {
        return service.listar().stream().map(ContaResponse::from).toList();
    }

    @GetMapping("/{numero}")
    public ContaResponse buscar(@PathVariable String numero) {
        return ContaResponse.from(service.buscarPorNumero(numero));
    }

    @PostMapping("/{numero}/deposito")
    public ContaResponse depositar(@PathVariable String numero,
                                   @RequestParam BigDecimal valor) {
        return ContaResponse.from(service.depositar(numero, valor));
    }
}
