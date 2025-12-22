package com.intern.taskservice.service;

import com.intern.taskservice.dto.TaskRequest;
import com.intern.taskservice.dto.TaskResponse;
import com.intern.taskservice.model.Task;
import com.intern.taskservice.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskResponse createTask(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProjectId(request.getProjectId());
        task.setDueDate(request.getDueDate());
        task.setCompleted(false);

        task = taskRepository.save(task);

        return mapToResponse(task);
    }

    public List<TaskResponse> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        return mapToResponse(task);
    }

    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());

        task = taskRepository.save(task);

        return mapToResponse(task);
    }

    public TaskResponse toggleTaskCompletion(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setCompleted(!task.getCompleted());
        task = taskRepository.save(task);

        return mapToResponse(task);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        taskRepository.delete(task);
    }

    public List<TaskResponse> searchTasks(Long projectId, String query) {
        return taskRepository.findByProjectIdAndTitleContainingIgnoreCase(projectId, query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> filterTasksByStatus(Long projectId, Boolean completed) {
        return taskRepository.findByProjectIdAndCompleted(projectId, completed)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getProjectStats(Long projectId) {
        long totalTasks = taskRepository.countByProjectId(projectId);
        long completedTasks = taskRepository.countByProjectIdAndCompleted(projectId, true);
        double progressPercentage = totalTasks > 0 ? (completedTasks * 100.0) / totalTasks : 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTasks", (int) totalTasks);
        stats.put("completedTasks", (int) completedTasks);
        stats.put("progressPercentage", Math.round(progressPercentage * 100.0) / 100.0);

        return stats;
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setProjectId(task.getProjectId());
        response.setDueDate(task.getDueDate());
        response.setCompleted(task.getCompleted());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());

        return response;
    }
}
