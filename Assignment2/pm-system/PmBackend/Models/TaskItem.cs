using System.ComponentModel.DataAnnotations;

namespace PmBackend.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        // Foreign key
        public int ProjectId { get; set; }

        // Navigation property
        public Project? Project { get; set; }
    }
}
