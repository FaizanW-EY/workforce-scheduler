namespace api.Models
{
    public class UtilizationSummary
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public double ScheduledHours { get; set; }
        public double WorkedHours { get; set; }
        public double UtilizationPercent { get; set; }
        public double OvertimeHours { get; set; }
        public double UnderutilizationHours { get; set; }
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}
