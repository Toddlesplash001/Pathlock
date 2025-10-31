using System.Collections.Generic;

namespace PmBackend.Models
{
    public class ScheduleRequest
    {
        public List<TaskItem> Tasks { get; set; } = new();
    }
}
