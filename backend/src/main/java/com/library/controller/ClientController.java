package com.library.controller;

import com.library.dto.ClientDTO;
import com.library.mapper.ClientMapper;
import com.library.model.Client;
import com.library.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private ClientMapper clientMapper;

    @GetMapping
    public List<ClientDTO> getAllClients() {  // ← Возвращать DTO
        return clientService.getAllClients().stream()
                .map(clientMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Integer id) {
        Optional<Client> client = clientService.getClientById(id);
        return client.map(c -> ResponseEntity.ok(clientMapper.toDTO(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ClientDTO createClient(@RequestBody ClientDTO clientDTO) {
        Client client = clientMapper.toEntity(clientDTO);
        Client savedClient = clientService.saveClient(client);
        return clientMapper.toDTO(savedClient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Integer id, @RequestBody ClientDTO clientDTO) {
        if (!clientService.clientExists(id)) {
            return ResponseEntity.notFound().build();
        }
        clientDTO.setId(id);
        Client client = clientMapper.toEntity(clientDTO);
        Client updatedClient = clientService.saveClient(client);
        return ResponseEntity.ok(clientMapper.toDTO(updatedClient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Integer id) {
        if (!clientService.clientExists(id)) {
            return ResponseEntity.notFound().build();
        }
        clientService.deleteClient(id);
        return ResponseEntity.ok().build();
    }
}