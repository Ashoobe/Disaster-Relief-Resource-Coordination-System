package com.lewis.disaster_relief_platform.emergency.service;

import com.lewis.disaster_relief_platform.common.exception.domain.BusinessException;
import com.lewis.disaster_relief_platform.common.exception.domain.ResourceNotFoundException;
import com.lewis.disaster_relief_platform.emergency.dto.request.EmergencyRequest;
import com.lewis.disaster_relief_platform.emergency.dto.request.LocationRequest;
import com.lewis.disaster_relief_platform.emergency.dto.response.EmergencyResponse;
import com.lewis.disaster_relief_platform.emergency.dto.response.EmergencyTrackingResponse;
import com.lewis.disaster_relief_platform.emergency.kafka.EmergencyEventPublisher;
import com.lewis.disaster_relief_platform.emergency.model.*;
import com.lewis.disaster_relief_platform.emergency.repository.EmergencyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmergencyServiceTest {

    @Mock
    private EmergencyRepository emergencyRepository;

    @Mock
    private EmergencyEventPublisher emergencyEventPublisher;

    @InjectMocks
    private EmergencyService emergencyService;

    @BeforeEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // ─── helpers ────────────────────────────────────────────────────────────────

    private EmergencyRequest buildValidRequest() {
        LocationRequest loc = new LocationRequest();
        loc.setLatitude(34.05);
        loc.setLongitude(-118.24);
        loc.setAddress("123 Main St");
        loc.setCity("Los Angeles");

        EmergencyRequest req = new EmergencyRequest();
        req.setTitle("Flood Relief Needed");
        req.setDescription("Severe flooding affecting residential area");
        req.setType(EmergencyType.RESCUE);
        req.setPriority(Priority.HIGH);
        req.setLocation(loc);
        req.setReportedBy("Jane Doe");
        req.setAffectedPeople(50);
        return req;
    }

    private Emergency buildSavedEmergency(Status status) {
        Location loc = Location.builder()
                .address("123 Main St").city("Los Angeles")
                .latitude(34.05).longitude(-118.24).build();

        return Emergency.builder()
                .id("em-001")
                .trackingCode("Prithu-2026-ABCD1234")
                .title("Flood Relief Needed")
                .description("Severe flooding affecting residential area")
                .type(EmergencyType.RESCUE)
                .priority(Priority.HIGH)
                .status(status)
                .location(loc)
                .reportedBy("Jane Doe")
                .affectedPeople(50)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    // ─── CreateEmergency ─────────────────────────────────────────────────────────

    @Test
    void createEmergency_anonymousUser_statusIsPendingVerification() {
        // Arrange: no authentication in context → anonymous
        Emergency saved = buildSavedEmergency(Status.PENDING_VERIFICATION);
        when(emergencyRepository.save(any(Emergency.class))).thenReturn(saved);

        // Act
        EmergencyResponse response = emergencyService.CreateEmergency(buildValidRequest());

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getTrackingCode()).isEqualTo("Prithu-2026-ABCD1234");
        verify(emergencyEventPublisher).publishEmergencyCreated(any());
    }

    @Test
    void createEmergency_authenticatedUser_statusIsPending() {
        // Arrange: set an authenticated user
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("user-42", null, Collections.emptyList()));

        Emergency saved = buildSavedEmergency(Status.PENDING);
        when(emergencyRepository.save(any(Emergency.class))).thenReturn(saved);

        // Act
        EmergencyResponse response = emergencyService.CreateEmergency(buildValidRequest());

        // Assert: saved emergency should carry the current user id
        ArgumentCaptor<Emergency> captor = ArgumentCaptor.forClass(Emergency.class);
        verify(emergencyRepository).save(captor.capture());
        assertThat(captor.getValue().getCreatedByUserId()).isEqualTo("user-42");
        assertThat(captor.getValue().getStatus()).isEqualTo(Status.PENDING);
    }

    @Test
    void createEmergency_negativeAffectedPeople_throwsBusinessException() {
        EmergencyRequest req = buildValidRequest();
        req.setAffectedPeople(-1);

        assertThatThrownBy(() -> emergencyService.CreateEmergency(req))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Affected people count cannot be negative");
    }

    @Test
    void createEmergency_invalidLatitude_throwsBusinessException() {
        EmergencyRequest req = buildValidRequest();
        req.getLocation().setLatitude(91.0);

        assertThatThrownBy(() -> emergencyService.CreateEmergency(req))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("latitude");
    }

    @Test
    void createEmergency_invalidLongitude_throwsBusinessException() {
        EmergencyRequest req = buildValidRequest();
        req.getLocation().setLongitude(-181.0);

        assertThatThrownBy(() -> emergencyService.CreateEmergency(req))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("longitude");
    }

    // ─── trackByCode ─────────────────────────────────────────────────────────────

    @Test
    void trackByCode_existingCode_returnsTrackingResponse() {
        Emergency emergency = buildSavedEmergency(Status.PENDING);
        when(emergencyRepository.findByTrackingCode("TRACK-001")).thenReturn(Optional.of(emergency));

        EmergencyTrackingResponse response = emergencyService.trackByCode("TRACK-001");

        assertThat(response).isNotNull();
        assertThat(response.getTrackingCode()).isEqualTo("Prithu-2026-ABCD1234");
    }

    @Test
    void trackByCode_unknownCode_throwsResourceNotFoundException() {
        when(emergencyRepository.findByTrackingCode("UNKNOWN")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> emergencyService.trackByCode("UNKNOWN"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ─── updateEmergencyStatus
    // ────────────────────────────────────────────────────

    @Test
    void updateEmergencyStatus_resolvedToOther_throwsBusinessException() {
        Emergency emergency = buildSavedEmergency(Status.RESOLVED);
        when(emergencyRepository.findById("em-001")).thenReturn(Optional.of(emergency));

        assertThatThrownBy(() -> emergencyService.updateEmergencyStatus("em-001", Status.PENDING))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Resolved");
    }

    @Test
    void updateEmergencyStatus_cancelled_throwsBusinessException() {
        Emergency emergency = buildSavedEmergency(Status.CANCELLED);
        when(emergencyRepository.findById("em-001")).thenReturn(Optional.of(emergency));

        assertThatThrownBy(() -> emergencyService.updateEmergencyStatus("em-001", Status.PENDING))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("cancelled");
    }

    @Test
    void updateEmergencyStatus_toResolved_setsResolvedAt() {
        Emergency emergency = buildSavedEmergency(Status.IN_PROGRESS);
        when(emergencyRepository.findById("em-001")).thenReturn(Optional.of(emergency));
        when(emergencyRepository.save(any())).thenReturn(emergency);

        emergencyService.updateEmergencyStatus("em-001", Status.RESOLVED);

        assertThat(emergency.getStatus()).isEqualTo(Status.RESOLVED);
        assertThat(emergency.getResolvedAt()).isNotNull();
        verify(emergencyEventPublisher).publishStatusUpdated(any());
    }

    // ─── assignVolunteer
    // ──────────────────────────────────────────────────────────

    @Test
    void assignVolunteer_pendingEmergency_setsAssignedStatus() {
        Emergency emergency = buildSavedEmergency(Status.PENDING);
        when(emergencyRepository.findById("em-001")).thenReturn(Optional.of(emergency));
        when(emergencyRepository.save(any())).thenReturn(emergency);

        emergencyService.assignVolunteer("em-001", "vol-999");

        assertThat(emergency.getStatus()).isEqualTo(Status.ASSIGNED);
        assertThat(emergency.getAssignedVolunteerId()).isEqualTo("vol-999");
        verify(emergencyEventPublisher).publishVolunteerAssigned(any(), eq("vol-999"));
    }

    @Test
    void assignVolunteer_nonPendingEmergency_throwsBusinessException() {
        Emergency emergency = buildSavedEmergency(Status.IN_PROGRESS);
        when(emergencyRepository.findById("em-001")).thenReturn(Optional.of(emergency));

        assertThatThrownBy(() -> emergencyService.assignVolunteer("em-001", "vol-999"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("PENDING");
    }

    // ─── deleteEmergency
    // ──────────────────────────────────────────────────────────

    @Test
    void deleteEmergency_inProgressEmergency_throwsBusinessException() {
        Emergency emergency = buildSavedEmergency(Status.IN_PROGRESS);
        when(emergencyRepository.findById("em-001")).thenReturn(Optional.of(emergency));

        assertThatThrownBy(() -> emergencyService.deleteEmergency("em-001"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("in progress");
    }

    @Test
    void deleteEmergency_pendingEmergency_callsDeleteById() {
        Emergency emergency = buildSavedEmergency(Status.PENDING);
        when(emergencyRepository.findById("em-001")).thenReturn(Optional.of(emergency));

        emergencyService.deleteEmergency("em-001");

        verify(emergencyRepository).deleteById("em-001");
    }

    // ─── linkEmergenciesToUser
    // ────────────────────────────────────────────────────

    @Test
    void linkEmergenciesToUser_noUnlinked_doesNotSave() {
        when(emergencyRepository.findByReportedByEmailAndCreatedByUserIdIsNull("test@example.com"))
                .thenReturn(Collections.emptyList());

        emergencyService.linkEmergenciesToUser("user-1", "test@example.com");

        verify(emergencyRepository, never()).save(any());
    }

    @Test
    void linkEmergenciesToUser_withUnlinked_upgradesStatusAndSaves() {
        Emergency emergency = buildSavedEmergency(Status.PENDING_VERIFICATION);
        when(emergencyRepository.findByReportedByEmailAndCreatedByUserIdIsNull("test@example.com"))
                .thenReturn(List.of(emergency));

        emergencyService.linkEmergenciesToUser("user-1", "test@example.com");

        assertThat(emergency.getCreatedByUserId()).isEqualTo("user-1");
        assertThat(emergency.getStatus()).isEqualTo(Status.PENDING);
        verify(emergencyRepository).save(emergency);
    }
}
