package com.lewis.disaster_relief_platform.emergency.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyUpdateRequest {
    private String status; // e.g. "assigned", "in-progress", "completed"
    private String assignedTo; // volunteer/user ID (maps to assignedVolunteerId)
    private String assigneeName; // display name of the assignee
    private String assigneeEmail; // email of the assignee
    private String notes; // general notes / completion description
    private String completionNotes; // alias for notes sent by the frontend
    private String completedBy; // name of the person who completed the task
}
