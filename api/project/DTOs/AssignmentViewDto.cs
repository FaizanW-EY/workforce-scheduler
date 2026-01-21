using static api.Models.ShiftAssignment;

namespace api.DTOs
{
    public class AssignmentViewDto
    {
        public Guid AssignmentId { get; set; }
        public string ShiftName { get; set; }
        public DateTime ShiftDate { get; set; }
        public int EmployeeId { get; set; }
        public AssignmentStatus Status { get; set; }
        public bool OverrideUsed { get; set; }
    }
}
