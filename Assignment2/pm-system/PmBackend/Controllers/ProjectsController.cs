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
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ProjectService _projectService;

        public ProjectsController(ProjectService projectService)
        {
            _projectService = projectService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ✅ GET /api/projects
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _projectService.GetProjectsByUserAsync(GetUserId());
            return Ok(projects);
        }

        // ✅ GET /api/projects/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(GetUserId(), id);
            if (project == null) return NotFound();
            return Ok(project);
        }

        // ✅ POST /api/projects
        [HttpPost]
        public async Task<IActionResult> CreateProject(ProjectDto dto)
        {
            var project = new Project
            {
                Title = dto.Title,                // fixed from Name → Title
                Description = dto.Description,
                UserId = GetUserId()
            };

            var created = await _projectService.CreateProjectAsync(project);
            return Ok(created);
        }

        // ✅ DELETE /api/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var success = await _projectService.DeleteProjectAsync(GetUserId(), id);
            if (!success) return NotFound();
            return Ok("Project deleted successfully");
        }
    }
}
