package com.example.backend;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class MyController {

    private final List<Task> tasks = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    @GetMapping("/hello")
    public String hello() {
        return "Backend is working 😎";
    }

    @GetMapping("/tasks")
    public List<Task> getTasks() {
        return tasks;
    }

    @PostMapping("/tasks")
    public Task createTask(@RequestBody Task task) {
        long id = idCounter.getAndIncrement();
        task.setId(id);
        tasks.add(task);
        return task;
    }

    @PostMapping("/tasks/{id}/toggle")
    public Task toggleTask(@PathVariable Long id) {
        for (Task t : tasks) {
            if (t.getId().equals(id)) {
                t.setCompleted(!t.isCompleted());
                return t;
            }
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
    }

    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        boolean removed = tasks.removeIf(t -> t.getId().equals(id));
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }
    }
}
