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

        [HttpGet]
        public async Task<IActionResult> GetUserProjects()
        {
            var projects = await _projectService.GetProjectsByUserAsync(GetUserId());
            return Ok(projects);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(ProjectDto dto)
        {
            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = GetUserId()
            };

            var created = await _projectService.CreateProjectAsync(project);
            return Ok(created);
        }

        [HttpDelete("{projectId}")]
        public async Task<IActionResult> DeleteProject(int projectId)
        {
            var success = await _projectService.DeleteProjectAsync(GetUserId(), projectId);
            if (!success) return NotFound();
            return Ok("Project deleted successfully");
        }
    }
}
