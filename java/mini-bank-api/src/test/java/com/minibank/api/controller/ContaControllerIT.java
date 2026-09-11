package com.minibank.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minibank.api.dto.ContaRequest;
import com.minibank.api.model.TipoConta;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ContaControllerIT {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    @Test
    void deveCriarEBuscarConta() throws Exception {
        var req = new ContaRequest("999", "Maria", TipoConta.POUPANCA,
                                   new BigDecimal("500"));

        mvc.perform(post("/api/v1/contas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(req)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.numero").value("999"));

        mvc.perform(get("/api/v1/contas/999"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.titular").value("Maria"));
    }
}
