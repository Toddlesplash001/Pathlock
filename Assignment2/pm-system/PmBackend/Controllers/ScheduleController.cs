using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PmBackend.Models;
using PmBackend.Services;

namespace PmBackend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v1/projects/{projectId}/schedule")]
    public class ScheduleController : ControllerBase
    {
        private readonly TaskService _taskService;

        public ScheduleController(TaskService taskService)
        {
            _taskService = taskService;
        }

        /// <summary>
        /// Generate a recommended order for project tasks using topological sort (DFS-based).
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GenerateSchedule(int projectId, [FromBody] ScheduleRequest request)
        {
            if (request == null || request.Tasks == null || !request.Tasks.Any())
                return BadRequest("No tasks provided for scheduling.");

            try
            {
                var orderedTasks = TopologicalSort(request.Tasks);

                return Ok(new
                {
                    recommendedOrder = orderedTasks.Select(t => t.Title).ToList()
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error generating schedule: {ex.Message}");
            }
        }

        // --- DFS-based Topological Sort ---
        private List<TaskItem> TopologicalSort(IEnumerable<TaskItem> tasks)
        {
            var result = new List<TaskItem>();
            var visited = new HashSet<string>();
            var visiting = new HashSet<string>();
            var taskMap = tasks.ToDictionary(t => t.Title, t => t);

            void DFS(TaskItem task)
            {
                if (visited.Contains(task.Title)) return;
                if (visiting.Contains(task.Title))
                    throw new Exception($"Circular dependency detected at '{task.Title}'.");

                visiting.Add(task.Title);

                foreach (var dep in task.Dependencies)
                {
                    if (taskMap.TryGetValue(dep, out var depTask))
                        DFS(depTask);
                }

                visiting.Remove(task.Title);
                visited.Add(task.Title);
                result.Add(task);
            }

            foreach (var task in tasks)
                DFS(task);

            // Optional: sort by due date
            return result
                .OrderBy(t => t.DueDate ?? DateTime.MaxValue)
                .ToList();
        }
    }
}
