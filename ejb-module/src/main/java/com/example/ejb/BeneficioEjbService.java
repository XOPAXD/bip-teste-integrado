package com.example.ejb;

import com.example.ejb.model.Beneficio;
import jakarta.ejb.LocalBean;
import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Stateless
@LocalBean
public class BeneficioEjbService {

    @PersistenceContext
    @Autowired
    private EntityManager em;

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        Beneficio from = em.find(Beneficio.class, fromId);
        Beneficio to   = em.find(Beneficio.class, toId);

        if (from == null || to == null) {
            throw new RuntimeException("Benefício não encontrado!");
        }

        if (from.getValor().compareTo(amount) < 0) {
            throw new RuntimeException("Saldo insuficiente no benefício de origem.");
        }

        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));

        em.merge(from);
        em.merge(to);
    }
}
