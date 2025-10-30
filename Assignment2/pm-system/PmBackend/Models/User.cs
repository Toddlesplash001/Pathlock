using System.ComponentModel.DataAnnotations;

namespace PmBackend.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation property: one user can have multiple projects
        public List<Project> Projects { get; set; } = new List<Project>();
    }
}
