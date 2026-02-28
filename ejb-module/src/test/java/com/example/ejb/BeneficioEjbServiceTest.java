package com.example.ejb;

import com.example.ejb.model.Beneficio;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BeneficioEjbServiceTest {

    @Mock
    private EntityManager em;

    @InjectMocks
    private BeneficioEjbService ejbService;

    private Beneficio origem;
    private Beneficio destino;

    @BeforeEach
    void setup() {
        origem = new Beneficio();
        origem.setId(1L);
        origem.setValor(new BigDecimal("100.00"));

        destino = new Beneficio();
        destino.setId(2L);
        destino.setValor(new BigDecimal("50.00"));
    }

    @Test
    void deveRealizarTransferenciaComSucesso() {
        when(em.find(Beneficio.class, 1L)).thenReturn(origem);
        when(em.find(Beneficio.class, 2L)).thenReturn(destino);

        ejbService.transfer(1L, 2L, new BigDecimal("30.00"));

        assertEquals(new BigDecimal("70.00"), origem.getValor());
        assertEquals(new BigDecimal("80.00"), destino.getValor());
        verify(em, times(2)).merge(any());
    }

    @Test
    void deveLancarErroQuandoSaldoForInsuficiente() {
        when(em.find(Beneficio.class, 1L)).thenReturn(origem);
        when(em.find(Beneficio.class, 2L)).thenReturn(destino);

        BigDecimal valorMaiorQueSaldo = new BigDecimal("200.00");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            ejbService.transfer(1L, 2L, valorMaiorQueSaldo);
        });

        assertEquals("Saldo insuficiente no benefício de origem.", exception.getMessage());
    }
}