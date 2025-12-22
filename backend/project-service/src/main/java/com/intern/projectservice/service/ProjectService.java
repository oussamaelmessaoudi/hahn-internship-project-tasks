package com.intern.projectservice.service;

import com.intern.projectservice.dto.ProjectRequest;
import com.intern.projectservice.dto.ProjectResponse;
import com.intern.projectservice.model.Project;
import com.intern.projectservice.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${auth.service.url}")
    private String authServiceUrl;

    public ProjectResponse createProject(ProjectRequest request, Long userId) {
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUserId(userId);

        project = projectRepository.save(project);

        return mapToResponse(project);
    }

    public List<ProjectResponse> getAllProjects(Long userId) {
        return projectRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id, Long userId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        return mapToResponse(project);
    }

    public ProjectResponse updateProject(Long id, ProjectRequest request, Long userId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());

        project = projectRepository.save(project);

        return mapToResponse(project);
    }

    public void deleteProject(Long id, Long userId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        projectRepository.delete(project);
    }

    public List<ProjectResponse> searchProjects(Long userId, String query) {
        return projectRepository.findByUserIdAndTitleContainingIgnoreCase(userId, query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProjectResponse mapToResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setUserId(project.getUserId());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());

        // Fetch task statistics from task service
        try {
            String url = "http://task-service:8083/api/tasks/project/" + project.getId() + "/stats";
            @SuppressWarnings("unchecked")
            Map<String, Object> stats = restTemplate.getForObject(url, Map.class);

            if (stats != null) {
                response.setTotalTasks((Integer) stats.get("totalTasks"));
                response.setCompletedTasks((Integer) stats.get("completedTasks"));
                response.setProgressPercentage((Double) stats.get("progressPercentage"));
            }
        } catch (Exception e) {
            // If task service is unavailable, set default values
            response.setTotalTasks(0);
            response.setCompletedTasks(0);
            response.setProgressPercentage(0.0);
        }

        return response;
    }
}
