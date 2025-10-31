using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace PmBackend.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        // Foreign key to Project
        public int ProjectId { get; set; }

        // Navigation property
        public Project? Project { get; set; }

        // --- Scheduling Fields (Optional) ---
        public int? EstimatedHours { get; set; }

        [NotMapped]
        public List<string> Dependencies { get; set; } = new();

        // Store dependencies as serialized JSON
        public string? DependenciesSerialized
        {
            get => Dependencies != null && Dependencies.Any()
                ? JsonSerializer.Serialize(Dependencies)
                : null;
            set => Dependencies = string.IsNullOrEmpty(value)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(value!) ?? new List<string>();
        }
    }
}
