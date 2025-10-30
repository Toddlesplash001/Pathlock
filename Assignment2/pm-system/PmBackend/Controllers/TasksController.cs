using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PmBackend.DTOs;
using PmBackend.Models;
using PmBackend.Services;
using System.Security.Claims;

namespace PmBackend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ✅ POST /api/projects/{projectId}/tasks
        [HttpPost("projects/{projectId}/tasks")]
        public async Task<IActionResult> CreateTask(int projectId, TaskDto dto)
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                DueDate = dto.DueDate,
                ProjectId = projectId,
                IsCompleted = false
            };

            var created = await _taskService.CreateTaskAsync(task);
            return Ok(created);
        }

        // ✅ PUT /api/tasks/{taskId}
        [HttpPut("tasks/{taskId}")]
        public async Task<IActionResult> UpdateTask(int taskId, TaskDto dto)
        {
            // we’ll reuse your existing update status method or add one in service
            var success = await _taskService.UpdateTaskStatusAsync(GetUserId(), taskId, dto.IsCompleted);
            if (!success) return NotFound();
            return Ok("Task updated successfully");
        }

        // ✅ DELETE /api/tasks/{taskId}
        [HttpDelete("tasks/{taskId}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            var success = await _taskService.DeleteTaskAsync(GetUserId(), taskId);
            if (!success) return NotFound();
            return Ok("Task deleted successfully");
        }
    }
}
