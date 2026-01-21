namespace api.Models
{
    public class ShiftTemplate
    {
        public int Id { get; set; }

        public string Name { get; set; } = default!;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int BreakMinutes { get; set; }
        public int RequiredHeadcount { get; set; }
    }
}