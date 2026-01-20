namespace api.Dtos
{
    public class ShiftTemplateDto
    {
        public string Name { get; set; } = default!;
        public string StartTime { get; set; } = default!;  
        public string EndTime { get; set; } = default!;
        public int BreakMinutes { get; set; }
        public int RequiredHeadcount { get; set; }
    }
}

