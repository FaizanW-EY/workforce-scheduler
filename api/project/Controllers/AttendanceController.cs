using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Data;
using Microsoft.EntityFrameworkCore;
using api.DTOs;

namespace api.Controllers
{
    [Route("api/attendance")]
    [ApiController]

    public class AttendanceController : ControllerBase

    {

        private readonly ShiftDbContext _context;

        public AttendanceController(ShiftDbContext context)

        {

            _context = context;

        }

        [HttpPost("checkin/{assignmentId}")]

        public async Task<IActionResult> CheckIn(Guid assignmentId, CheckInDto dto)

        {

            var assignment = await _context.ShiftAssignments

                .Include(a => a.ShiftInstance)

                .ThenInclude(s => s.ShiftTemplate)

                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)

                return NotFound("Assignment not found");

            var existing = await _context.AttendanceLogs

                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (existing != null)

                return BadRequest("Attendance already exists");

            AttendanceStatus status;

            if (dto.CheckInTime == null)

            {

                status = AttendanceStatus.Absent;

            }

            else

            {

                var shiftStart = assignment.ShiftInstance.ShiftDate.Date

                    .Add(assignment.ShiftInstance.ShiftTemplate.StartTime);

                status = dto.CheckInTime > shiftStart.AddMinutes(10)

                    ? AttendanceStatus.Late

                    : AttendanceStatus.Present;

            }

            var log = new AttendanceLog

            {

                AssignmentId = assignmentId,

                EmployeeId = assignment.EmployeeId,

                CheckInTime = dto.CheckInTime,

                Status = status

            };

            _context.AttendanceLogs.Add(log);

            await _context.SaveChangesAsync();

            return Ok("Check-in saved");

        }
        [HttpPost("checkout/{assignmentId}")]

        public async Task<IActionResult> CheckOut(Guid assignmentId, CheckOutDto dto)

        {

            var log = await _context.AttendanceLogs

                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (log == null)

                return BadRequest("Check-in first");

            if (log.CheckOutTime != null)

                return BadRequest("Already checked out");

            log.CheckOutTime = dto.CheckOutTime;

            if (log.CheckInTime != null && dto.CheckOutTime != null)

            {

                log.WorkedHours = Math.Round(

                    (dto.CheckOutTime.Value - log.CheckInTime.Value).TotalHours, 2);

            }

            var assignment = await _context.ShiftAssignments

                .Include(a => a.ShiftInstance)

                .ThenInclude(s => s.ShiftTemplate)

                .FirstAsync(a => a.AssignmentId == assignmentId);

            var shiftEnd = assignment.ShiftInstance.ShiftDate.Date

                .Add(assignment.ShiftInstance.ShiftTemplate.EndTime);

            if (dto.CheckOutTime != null && dto.CheckOutTime < shiftEnd.AddMinutes(-10))

                log.Status = AttendanceStatus.EarlyLeave;

            await _context.SaveChangesAsync();

            return Ok("Attendence Marked Sucessfully");

        }

       

        [HttpPost("mark-absent/{assignmentId}")]

        public async Task<IActionResult> MarkAbsent(Guid assignmentId)

        {

            // 1️⃣ Validate assignment

            var assignment = await _context.ShiftAssignments

                .Include(a => a.ShiftInstance)

                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)

                return NotFound("Assignment not found");

            // 2️⃣ Prevent duplicate attendance

            var existing = await _context.AttendanceLogs

                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (existing != null)

                return BadRequest("Attendance already marked");

            // 3️⃣ Create absent record

            var log = new AttendanceLog

            {

                AssignmentId = assignment.AssignmentId,

                EmployeeId = assignment.EmployeeId,

                Status = AttendanceStatus.Absent,

                WorkedHours = 0

            };

            _context.AttendanceLogs.Add(log);

            await _context.SaveChangesAsync();

            return Ok("Absent marked");

        }

        [HttpGet("utilization")]
        public async Task<IActionResult> GetUtilization(
   [FromQuery] DateTime from,
   [FromQuery] DateTime to)
        {
            var data = await _context.UtilizationSummaries
                .Where(u =>
                    u.PeriodStart >= from.Date &&
                    u.PeriodEnd <= to.Date)
                .OrderBy(u => u.EmployeeId)
                .ToListAsync();
            return Ok(data);
        }


        [HttpPost("generate-utilization")]

        public async Task<IActionResult> GenerateUtilization(DateTime from, DateTime to)

        {

            var logs = await _context.AttendanceLogs

                .Include(a => a.ShiftAssignment)

                .ThenInclude(sa => sa.ShiftInstance)

                .ThenInclude(si => si.ShiftTemplate)

                .Where(a => a.ShiftAssignment.ShiftInstance.ShiftDate >= from
&& a.ShiftAssignment.ShiftInstance.ShiftDate <= to)

                .ToListAsync();

            if (!logs.Any())

                return Ok("No attendance logs found");

            var grouped = logs.GroupBy(x => x.EmployeeId);

            foreach (var g in grouped)

            {

                double scheduled = 0;

                double worked = 0;

                foreach (var l in g)

                {

                    var hours =

                        (l.ShiftAssignment.ShiftInstance.ShiftTemplate.EndTime -

                         l.ShiftAssignment.ShiftInstance.ShiftTemplate.StartTime)

                        .TotalHours;

                    scheduled += hours;

                    worked += l.WorkedHours;

                }

                var utilization = scheduled == 0 ? 0 : (worked / scheduled) * 100;

                var summary = new UtilizationSummary

                {

                    EmployeeId = g.Key,

                    PeriodStart = from,

                    PeriodEnd = to,

                    ScheduledHours = scheduled,

                    WorkedHours = worked,

                    UtilizationPercent = Math.Round(utilization, 2),

                    OvertimeHours = worked > scheduled ? worked - scheduled : 0,

                    UnderutilizationHours = scheduled > worked ? scheduled - worked : 0

                };

                _context.UtilizationSummaries.Add(summary);

            }

            await _context.SaveChangesAsync();

            return Ok("Utilization generated and saved");

        }

        [HttpGet("employee/{employeeId}")]

        public async Task<IActionResult> GetByEmployee(int employeeId)

        {

            var data = await _context.ShiftAssignments

                .Include(a => a.ShiftInstance)

                .ThenInclude(s => s.ShiftTemplate)

                .Where(a => a.EmployeeId == employeeId)
                 .Where(a => !_context.AttendanceLogs
           .Any(al => al.AssignmentId == a.AssignmentId))


                .Select(a => new ShiftAssignmentDto

                {

                    AssignmentId = a.AssignmentId,

                    EmployeeId = a.EmployeeId,

                    ShiftInstanceId = a.ShiftInstanceId,

                    ShiftDate = a.ShiftInstance.ShiftDate,

                    ShiftName = a.ShiftInstance.ShiftTemplate.Name,

                    StartTime = a.ShiftInstance.ShiftTemplate.StartTime,

                    EndTime = a.ShiftInstance.ShiftTemplate.EndTime,

                    Status = a.Status

                })

                .ToListAsync();

            return Ok(data);

        }


    }
}
   

