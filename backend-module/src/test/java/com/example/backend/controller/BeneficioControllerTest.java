package com.example.backend.controller;

import com.example.backend.repository.BeneficioRepository;
import com.example.ejb.BeneficioEjbService;
import com.example.ejb.model.Beneficio;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BeneficioController.class)
@AutoConfigureMockMvc
class BeneficioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BeneficioRepository repository;

    @MockBean
    private BeneficioEjbService ejbService;

    @Test
    void deveListarTodosOsBeneficios() throws Exception {
        Beneficio b = new Beneficio();
        b.setNome("Vale Refeição");

        when(repository.findAll()).thenReturn(Arrays.asList(b));

        mockMvc.perform(get("/api/v1/beneficios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Vale Refeição"));
    }

    @Test
    void deveChamarTransferenciaNoEjbComSucesso() throws Exception {
        mockMvc.perform(post("/api/v1/beneficios/transferir")
                        .param("from", "1")
                        .param("to", "2")
                        .param("valor", "50.00"))
                .andExpect(status().isOk());

        verify(ejbService, times(1)).transfer(eq(1L), eq(2L), any(BigDecimal.class));
    }
}