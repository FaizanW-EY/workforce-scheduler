namespace api.Models
{
    public class AssignmentViolation
    {
        public string ViolationId { get; set; } = Guid.NewGuid().ToString();
        public string AssignmentId { get; set; } = default!;
        public ViolationType Type { get; set; }
        public string Message { get; set; } = default!;

    }
}
