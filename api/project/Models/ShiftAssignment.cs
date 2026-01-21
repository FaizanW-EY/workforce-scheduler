using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;
public class ShiftAssignment
{
    [Key]
    public Guid AssignmentId { get; set; } = Guid.NewGuid();
    public int ShiftInstanceId { get; set; }
    public ShiftInstance ShiftInstance { get; set; }= default!;
    public int EmployeeId { get; set; } = default!;

    public User Employee { get; set; } = default!;
    public AssignmentStatus Status { get; set; } = AssignmentStatus.PendingApproval;
    
    public bool OverrideUsed { get; set; }
    public string? OverrideReason { get; set; }
    public string? ApprovedBy { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    public enum AssignmentStatus
    {
        PendingApproval=0,
        Approved=1,
        Rejected=2,
        
          
    }



}


