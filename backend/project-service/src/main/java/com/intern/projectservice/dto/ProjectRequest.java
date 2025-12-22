package com.intern.projectservice.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;
}
