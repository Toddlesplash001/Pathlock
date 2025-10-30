using System.ComponentModel.DataAnnotations;

namespace PmBackend.DTOs
{
    public class TaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; }
    }
}
