namespace api.Models
{

    public class SchedulingRule
    {
        public int Id { get; set; }

        public int MaxDailyHours { get; set; }                  
        public int MaxWeeklyHours { get; set; }                
        public int MinRestPeriodHours { get; set; }             
        public int OvertimeThresholdWeeklyHours { get; set; }   

    }

}
