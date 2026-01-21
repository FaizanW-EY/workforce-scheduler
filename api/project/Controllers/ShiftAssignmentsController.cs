using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using static api.Models.ShiftAssignment;
using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/project")]
    public class ShiftAssignmentsController : ControllerBase
    {
        private readonly ShiftDbContext _context;
        public ShiftAssignmentsController(ShiftDbContext context)
        {
            _context = context;
        }
        // 1️⃣ Assign employee to shift
        [HttpPost]
        public async Task<IActionResult> Assign(AssignShiftDto dto)
        {
            // Check shift exists
            var shift = await _context.ShiftInstances
                .Include(s => s.ShiftTemplate)
                .FirstOrDefaultAsync(s => s.Id == dto.ShiftInstanceId);
            if (shift == null)
                return BadRequest(new { message = "Shift instance not found" });
            // Check employee exists
            var employeeExists = await _context.Users.AnyAsync(u => u.Id == dto.EmployeeId);
            if (!employeeExists)
                return BadRequest(new { message = "Employee not found" });
            // Count existing assignments for this shift
            var assignedCount = await _context.ShiftAssignments
                .CountAsync(a => a.ShiftInstanceId == dto.ShiftInstanceId);
            var required = shift.RequiredHeadcountOverride
                           ?? shift.ShiftTemplate.RequiredHeadcount;
            if (assignedCount >= required)
                return BadRequest(new { message = "Shift already fully assigned" });
            // Prevent same employee duplicate assignment
            var duplicate = await _context.ShiftAssignments
                .AnyAsync(a => a.ShiftInstanceId == dto.ShiftInstanceId
     && a.EmployeeId == dto.EmployeeId);
            if (duplicate)
                return BadRequest(new { message = "Employee already assigned to this shift" });
            var assignment = new ShiftAssignment
            {
                ShiftInstanceId = dto.ShiftInstanceId,
                EmployeeId = dto.EmployeeId,
                Status = AssignmentStatus.PendingApproval
            };
            _context.ShiftAssignments.Add(assignment);
            await _context.SaveChangesAsync();
            return Ok("Shift assigned successfully");
        }
        // 2️⃣ Get all assignments
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.ShiftAssignments
                .Include(a => a.ShiftInstance)
                    .ThenInclude(s => s.ShiftTemplate)
                .Include(a => a.Employee)
                .ToListAsync();
            return Ok(data);
        }
        // 3️⃣ Get assignments for employee
        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> ByEmployee(int employeeId)
        {
            var data = await _context.ShiftAssignments
                .Where(a => a.EmployeeId == employeeId)
                .Include(a => a.ShiftInstance)
                    .ThenInclude(s => s.ShiftTemplate)
                .ToListAsync();
            return Ok(data);
        }
        //approve
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve(Guid id)
        {
            var assignment = await _context.ShiftAssignments.FindAsync(id);
            if (assignment == null)
                return NotFound("Assignment not found");
            assignment.Status = AssignmentStatus.Approved;
            assignment.ApprovedBy = User.Identity?.Name ?? "Manager";
            await _context.SaveChangesAsync();
            return Ok("Assignment approved");
        }

        // 5️⃣ Manager reject assignment
        [HttpPost("reject/{id}")]
        public async Task<IActionResult> Reject(Guid id)
        {
            var assignment = await _context.ShiftAssignments.FindAsync(id);
            if (assignment == null)
                return NotFound("Assignment not found");
            assignment.Status = AssignmentStatus.Rejected;
            await _context.SaveChangesAsync();
            return Ok("Assignment rejected");
        }

        [HttpPost("override/{id}")]
        public async Task<IActionResult> Override(Guid id, OverrideDto dto)
        {
            var assignment = await _context.ShiftAssignments.FindAsync(id);
            if (assignment == null)
                return NotFound("Assignment not found");
            assignment.EmployeeId = dto.NewEmployeeId;
            assignment.OverrideUsed = true;
            assignment.OverrideReason = dto.Reason;
            assignment.Status = AssignmentStatus.Approved;
            assignment.ApprovedBy = User.Identity!.Name;
            await _context.SaveChangesAsync();
            return Ok("Assignment overridden and approved");
        }

        [HttpGet("pending")]
        public async Task<IActionResult> Pending()
        {
            return Ok(await _context.ShiftAssignments
                .Where(a => a.Status == AssignmentStatus.PendingApproval)
                .Include(a => a.ShiftInstance)
                .ThenInclude(s => s.ShiftTemplate)
                .ToListAsync());
        }

        [HttpPost("auto")]
        public async Task<IActionResult> AutoAssign(AutoAssignDto dto)
        {
            var shifts = await _context.ShiftInstances
                .Include(s => s.ShiftTemplate)
                .Where(s => s.ShiftDate >= dto.FromDate && s.ShiftDate <= dto.ToDate)
                .ToListAsync();
            var employees = await _context.Users
                .Where(u => u.RoleId == 3)
                .OrderBy(e => Guid.NewGuid())
                .ToListAsync();
            foreach (var shift in shifts)
            {
                int required = shift.RequiredHeadcountOverride ??
                               shift.ShiftTemplate.RequiredHeadcount;
                int assignedCount = await _context.ShiftAssignments
                    .CountAsync(a => a.ShiftInstanceId == shift.Id);
                foreach (var emp in employees)
                {
                    if (assignedCount >= required)
                        break;
                    // Already working that day
                    bool alreadyAssigned = await _context.ShiftAssignments.AnyAsync(a =>
                        a.EmployeeId == emp.Id &&
                        a.ShiftInstance.ShiftDate == shift.ShiftDate);
                    if (alreadyAssigned)
                        continue;
                    // Availability
                    var avs = await _context.Availabilities
                        .Where(a => a.UserId == emp.Id && a.IsAvailable)
                        .ToListAsync();
                    bool available = avs.Any(a =>
                        a.Day == shift.ShiftDate.DayOfWeek);
                    if (!available) continue;
                    _context.ShiftAssignments.Add(new ShiftAssignment
                    {
                        ShiftInstanceId = shift.Id,
                        EmployeeId = emp.Id,
                        Status = AssignmentStatus.PendingApproval
                    });
                    assignedCount++;
                }
            }
            await _context.SaveChangesAsync();
            Console.WriteLine(_context.Database.GetConnectionString());
            return Ok("Auto assignment completed with workload balance");
        }




        ////manager can view approved shifts
        [HttpGet("manager/all")]
        public async Task<IActionResult> ManagerView()
        {
            var data = await _context.ShiftAssignments
                .Include(a => a.ShiftInstance)
                .ThenInclude(s => s.ShiftTemplate)
                .Select(a => new AssignmentViewDto
                {
                    AssignmentId = a.AssignmentId,
                    ShiftName = a.ShiftInstance.ShiftTemplate.Name,
                    ShiftDate = a.ShiftInstance.ShiftDate,
                    EmployeeId = a.EmployeeId,
                    Status = a.Status,
                    OverrideUsed = a.OverrideUsed
                })
                .ToListAsync();
            return Ok(data);
        }

        ////employee can view approved shifts for themselves
        [HttpGet("employee/{id}/schedule")]
        public async Task<IActionResult> EmployeeView(int id)
        {
            var data = await _context.ShiftAssignments
                .Where(a => a.EmployeeId == id && a.Status == AssignmentStatus.Approved)
                .Include(a => a.ShiftInstance)
                .ThenInclude(s => s.ShiftTemplate)
                .Select(a => new AssignmentViewDto
                {
                    AssignmentId = a.AssignmentId,
                    ShiftName = a.ShiftInstance.ShiftTemplate.Name,
                    ShiftDate = a.ShiftInstance.ShiftDate,
                    EmployeeId = a.EmployeeId,
                    Status = a.Status
                })
                .ToListAsync();
            return Ok(data);
        }

        private async Task<bool> CanAssign(int empId, ShiftInstance shift, SchedulingRule rule)
        {
            if (!await IsAvailable(empId, shift))
                return false;
            if (await HasOverlap(empId, shift))
                return false;
            if (!await WeeklyHoursOk(empId, shift, rule))
                return false;
            if (!await RestPeriodOk(empId, shift, rule))
                return false;
            return true;
        }

        private async Task<bool> HasOverlap(int empId, ShiftInstance shift)
        {
            var time = shift.ShiftTemplate;
            return await _context.ShiftAssignments
                .Include(a => a.ShiftInstance)
                .ThenInclude(s => s.ShiftTemplate)
                .AnyAsync(a =>
                    a.EmployeeId == empId &&
                    a.ShiftInstance.ShiftDate == shift.ShiftDate &&
                    (
                        time.StartTime < a.ShiftInstance.ShiftTemplate.EndTime &&
                        time.EndTime > a.ShiftInstance.ShiftTemplate.StartTime
                    ));
        }

        private async Task<bool> WeeklyHoursOk(int empId, ShiftInstance shift, SchedulingRule rule)
        {
            var weekStart = shift.ShiftDate.AddDays(-(int)shift.ShiftDate.DayOfWeek);
            var weekEnd = weekStart.AddDays(7);
            var shifts = await _context.ShiftAssignments
                .Include(a => a.ShiftInstance)
                .ThenInclude(s => s.ShiftTemplate)
                .Where(a => a.EmployeeId == empId &&
                            a.ShiftInstance.ShiftDate >= weekStart &&
                            a.ShiftInstance.ShiftDate < weekEnd)
                .ToListAsync();
            double total = shifts.Sum(s =>
                (s.ShiftInstance.ShiftTemplate.EndTime -
                 s.ShiftInstance.ShiftTemplate.StartTime).TotalHours);
            var newShiftHours =
                (shift.ShiftTemplate.EndTime - shift.ShiftTemplate.StartTime).TotalHours;
            return (total + newShiftHours) <= rule.MaxWeeklyHours;
        }

        private async Task<bool> RestPeriodOk(int empId, ShiftInstance shift, SchedulingRule rule)
        {
            var lastShift = await _context.ShiftAssignments
                .Include(a => a.ShiftInstance)
                .ThenInclude(s => s.ShiftTemplate)
                .Where(a => a.EmployeeId == empId)
                .OrderByDescending(a => a.ShiftInstance.ShiftDate)
                .FirstOrDefaultAsync();
            if (lastShift == null) return true;
            var lastEnd = lastShift.ShiftInstance.ShiftDate
                .Add(lastShift.ShiftInstance.ShiftTemplate.EndTime);
            var newStart = shift.ShiftDate.Add(shift.ShiftTemplate.StartTime);
            var hours = (newStart - lastEnd).TotalHours;
            return hours >= rule.MinRestPeriodHours;
        }

        private async Task<bool> IsAvailable(int empId, ShiftInstance shift)
        {
            return await _context.Availabilities.AnyAsync(a =>
                a.UserId == empId &&
                a.Day == shift.ShiftDate.DayOfWeek &&
                a.IsAvailable
            );
        }

    }
}


    