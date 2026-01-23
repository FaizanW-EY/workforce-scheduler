namespace api.Models
{
    public class AttendanceLog
    {
        public int Id { get; set; }
        public Guid AssignmentId { get; set; }
        public ShiftAssignment ShiftAssignment { get; set; } = default!;
        public int EmployeeId { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public double WorkedHours { get; set; }
        public AttendanceStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
public enum AttendanceStatus
{
    Present = 1,
    Late = 2,
    Absent = 3,
    EarlyLeave = 4
}

