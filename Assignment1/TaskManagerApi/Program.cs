using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using TaskManagerApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Enable CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowFrontend");

app.MapGet("/", () => "Task Manager API is running!");

// 🧩 In-memory storage
List<TaskItem> tasks = new();
int nextId = 1;

// ✅ Get all tasks
app.MapGet("/api/tasks", () =>
{
    return Results.Ok(tasks);
});

// ✅ Add a new task
app.MapPost("/api/tasks", (TaskItem newTask) =>
{
    newTask.Id = nextId++;
    tasks.Add(newTask);
    return Results.Created($"/api/tasks/{newTask.Id}", newTask);
});

// ✅ Update an existing task
app.MapPut("/api/tasks/{id:int}", (int id, TaskItem updatedTask) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task is null)
        return Results.NotFound();

    task.Description = updatedTask.Description;
    task.IsCompleted = updatedTask.IsCompleted;

    return Results.Ok(task);
});

// ✅ Delete a task
app.MapDelete("/api/tasks/{id:int}", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task is null)
        return Results.NotFound();

    tasks.Remove(task);
    return Results.NoContent();
});

app.Run();
