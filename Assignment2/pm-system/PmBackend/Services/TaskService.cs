using PmBackend.Data;
using PmBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace PmBackend.Services
{
    public class TaskService
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskItem>> GetTasksForProjectAsync(int userId, int projectId)
        {
            return await _context.Tasks
                .Where(t => t.ProjectId == projectId && t.Project!.UserId == userId)
                .ToListAsync();
        }

        public async Task<TaskItem?> CreateTaskAsync(TaskItem task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> UpdateTaskStatusAsync(int userId, int taskId, bool isCompleted)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project!.UserId == userId);

            if (task == null) return false;

            task.IsCompleted = isCompleted;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTaskAsync(int userId, int taskId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project!.UserId == userId);

            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
