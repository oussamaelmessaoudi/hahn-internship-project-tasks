package com.intern.taskservice.repository;

import com.intern.taskservice.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByProjectIdAndCompleted(Long projectId, Boolean completed);
    List<Task> findByProjectIdAndTitleContainingIgnoreCase(Long projectId, String title);
    long countByProjectId(Long projectId);
    long countByProjectIdAndCompleted(Long projectId, Boolean completed);
}
