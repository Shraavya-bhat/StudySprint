package com.example.backend;

public class Task {

    private Long id;
    private String text;
    private String subject;
    private boolean completed;

    public Task() {}

    public Task(Long id, String text, String subject, boolean completed) {
        this.id = id;
        this.text = text;
        this.subject = subject;
        this.completed = completed;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public String getSubject() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }
    public boolean isCompleted() {
        return completed;
    }
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
