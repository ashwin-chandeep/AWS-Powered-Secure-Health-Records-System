package com.clinic.service;

import com.clinic.dto.DoctorResponse;
import com.clinic.dto.ServiceResponse;
import com.clinic.entity.Doctor;
import com.clinic.entity.DoctorMedicalService;
import com.clinic.repository.DoctorMedicalServiceRepository;
import com.clinic.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepo;
    private final DoctorMedicalServiceRepository dmsRepo;

    public DoctorService(DoctorRepository doctorRepo, DoctorMedicalServiceRepository dmsRepo) {
        this.doctorRepo = doctorRepo;
        this.dmsRepo = dmsRepo;
    }

    public List<DoctorResponse> getDoctorsByCity(String city) {
        return doctorRepo.findByCity(city).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<DoctorResponse> getDoctorById(Long id) {
        return doctorRepo.findById(id).map(this::toResponse);
    }

    public List<String> getSpecializations(String city) {
        return doctorRepo.findByCity(city).stream()
                .map(Doctor::getSpecialization)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Optional<Doctor> getDoctorEntityByUserId(Long userId) {
        return doctorRepo.findByUserId(userId);
    }

    private DoctorResponse toResponse(Doctor d) {
        List<ServiceResponse> services = dmsRepo.findByDoctorId(d.getId()).stream()
                .map(dms -> ServiceResponse.builder()
                        .id(String.valueOf(dms.getService().getId()))
                        .name(dms.getService().getName())
                        .build())
                .collect(Collectors.toList());

        return DoctorResponse.builder()
                .id(String.valueOf(d.getUser().getId()))
                .name(d.getName())
                .hospitalName(d.getHospitalName())
                .specialization(d.getSpecialization())
                .fee(d.getFee())
                .timings(d.getTimings())
                .clinicAddress(d.getClinicAddress())
                .lat(d.getLat())
                .lng(d.getLng())
                .rating(d.getRating())
                .city(d.getCity())
                .services(services)
                .build();
    }
}
