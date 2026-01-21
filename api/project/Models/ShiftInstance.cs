namespace api.Models
{
    public class ShiftInstance
    {
        public int Id { get; set; }

        public int ShiftTemplateId { get; set; }
        public ShiftTemplate ShiftTemplate { get; set; } = default!;

        public DateTime ShiftDate { get; set; }

        public int? RequiredHeadcountOverride { get; set; }
    }
}
