namespace api.Dtos
{
    public class ShiftInstanceDto
    {
        public int ShiftTemplateId { get; set; }
        public DateTime ShiftDate { get; set; }
        public int? RequiredHeadcountOverride { get; set; }
    }
}
