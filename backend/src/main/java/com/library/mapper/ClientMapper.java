package com.library.mapper;

import com.library.dto.ClientDTO;
import com.library.model.Client;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    public ClientDTO toDTO(Client client) {
        if (client == null) return null;

        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setFirstName(client.getFirstName());
        dto.setLastName(client.getLastName());
        dto.setFatherName(client.getFatherName());
        dto.setPassportSeria(client.getPassportSeria());
        dto.setPassportNumber(client.getPassportNumber());

        return dto;
    }

    public Client toEntity(ClientDTO dto) {
        if (dto == null) return null;

        Client client = new Client();
        client.setId(dto.getId());
        client.setFirstName(dto.getFirstName());
        client.setLastName(dto.getLastName());
        client.setFatherName(dto.getFatherName());
        client.setPassportSeria(dto.getPassportSeria());
        client.setPassportNumber(dto.getPassportNumber());

        return client;
    }
}