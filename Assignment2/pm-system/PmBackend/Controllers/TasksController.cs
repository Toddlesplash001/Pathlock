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
    [Route("api/projects/{projectId}/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetTasks(int projectId)
        {
            var tasks = await _taskService.GetTasksForProjectAsync(GetUserId(), projectId);
            return Ok(tasks);
        }

        [HttpPost]
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

        [HttpPatch("{taskId}/toggle")]
        public async Task<IActionResult> ToggleTask(int projectId, int taskId)
        {
            var success = await _taskService.UpdateTaskStatusAsync(GetUserId(), taskId, true);
            if (!success) return NotFound();
            return Ok("Task marked as completed");
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int projectId, int taskId)
        {
            var success = await _taskService.DeleteTaskAsync(GetUserId(), taskId);
            if (!success) return NotFound();
            return Ok("Task deleted successfully");
        }
    }
}
