package com.clinic.service;

import com.clinic.dto.ServiceResponse;
import com.clinic.entity.MedicalService;
import com.clinic.repository.MedicalServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalServiceService {

    private final MedicalServiceRepository repo;

    public MedicalServiceService(MedicalServiceRepository repo) {
        this.repo = repo;
    }

    public List<ServiceResponse> getServicesByCity(String city) {
        List<MedicalService> list;
        if (city == null || city.isBlank()) {
            list = repo.findAll();
        } else {
            list = repo.findByCity(city);
        }
        return list.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ServiceResponse toResponse(MedicalService s) {
        return ServiceResponse.builder()
                .id(String.valueOf(s.getId()))
                .name(s.getName())
                .city(s.getCity())
                .build();
    }
}
