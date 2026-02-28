package com.example.backend.controller;

import com.example.backend.repository.BeneficioRepository;
import com.example.ejb.BeneficioEjbService;
import com.example.ejb.model.Beneficio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.ejb.EJB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/beneficios")
@Tag(name = "Benefícios", description = "Operações de gerenciamento de benefícios e transferências")
public class BeneficioController {

    @Autowired
    private BeneficioRepository repository;

    @EJB
    private BeneficioEjbService ejbService;

    @Operation(summary = "Lista todos os benefícios cadastrados")
    @GetMapping
    public List<Beneficio> listar() {
        return repository.findAll();
    }

    @Operation(summary = "Cria um novo benefício")
    @PostMapping
    public Beneficio salvar(@RequestBody Beneficio b) {
        return repository.save(b);
    }


    @Operation(summary = "Realiza transferência de valores entre dois benefícios")
    @PostMapping("/transferir")
    public void transferir(
            @RequestParam("from") Long from,
            @RequestParam("to") Long to,
            @RequestParam("valor") java.math.BigDecimal valor) {
        ejbService.transfer(from, to, valor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
