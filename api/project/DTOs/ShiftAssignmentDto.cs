using static api.Models.ShiftAssignment;

namespace api.DTOs
{
    public class ShiftAssignmentDto
    {
        public Guid AssignmentId { get; set; }

        public int EmployeeId { get; set; }

        public int ShiftInstanceId { get; set; }

        public DateTime ShiftDate { get; set; }

        public string ShiftName { get; set; } = "";

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public AssignmentStatus Status { get; set; }
    }
}
