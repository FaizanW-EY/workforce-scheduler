using api.Dtos;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShiftTemplatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private static double GetNetHours(TimeSpan start, TimeSpan end, int breakMinutes)
        {
            // Handle overnight shifts (end next day)
            var duration = end - start;
            if (duration < TimeSpan.Zero)
                duration += TimeSpan.FromHours(24);

            var net = duration - TimeSpan.FromMinutes(breakMinutes);
            return net.TotalHours;
        }


        public ShiftTemplatesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/shifttemplates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShiftTemplate>>> GetShiftTemplates()
        {
            return await _context.ShiftTemplates.ToListAsync();
        }

        // GET: api/shifttemplates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShiftTemplate>> GetShiftTemplate(int id)
        {
            var template = await _context.ShiftTemplates.FindAsync(id);

            if (template == null)
                return NotFound(new { message = "Shift template not found" });

            return template;
        }

        // POST: api/shifttemplates
        [HttpPost]
        public async Task<ActionResult<ShiftTemplate>> CreateShiftTemplate([FromBody] ShiftTemplateDto dto)
        {
            if (!TimeSpan.TryParse(dto.StartTime, out var start))
                return BadRequest(new { message = "Invalid StartTime. Use HH:mm or HH:mm:ss" });

            if (!TimeSpan.TryParse(dto.EndTime, out var end))
                return BadRequest(new { message = "Invalid EndTime. Use HH:mm or HH:mm:ss" });

            var template = new ShiftTemplate
            {
                Name = dto.Name,
                StartTime = start,
                EndTime = end,
                BreakMinutes = dto.BreakMinutes,
                RequiredHeadcount = dto.RequiredHeadcount
            };

            // Validation

            if (template.BreakMinutes < 0)
                return BadRequest(new { message = "Break minutes cannot be negative" });

            if (template.RequiredHeadcount <= 0)
                return BadRequest(new { message = "Required headcount must be greater than 0" });

            _context.ShiftTemplates.Add(template);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShiftTemplate), new { id = template.Id }, template);
        }

        // PUT: api/shifttemplates/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateShiftTemplate(int id, [FromBody] ShiftTemplateDto dto)
        {
            var template = await _context.ShiftTemplates.FindAsync(id);

            if (template == null)
                return NotFound(new { message = "Shift template not found" });

            if (!TimeSpan.TryParse(dto.StartTime, out var start))
                return BadRequest(new { message = "Invalid StartTime. Use HH:mm or HH:mm:ss" });

            if (!TimeSpan.TryParse(dto.EndTime, out var end))
                return BadRequest(new { message = "Invalid EndTime. Use HH:mm or HH:mm:ss" });

            template.Name = dto.Name;
            template.StartTime = start;
            template.EndTime = end;
            template.BreakMinutes = dto.BreakMinutes;
            template.RequiredHeadcount = dto.RequiredHeadcount;

            // Validation

            if (template.BreakMinutes < 0)
                return BadRequest(new { message = "Break minutes cannot be negative" });

            if (template.RequiredHeadcount <= 0)
                return BadRequest(new { message = "Required headcount must be greater than 0" });

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/shifttemplates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShiftTemplate(int id)
        {
            var template = await _context.ShiftTemplates.FindAsync(id);
            if (template == null)
                return NotFound(new { message = "Shift template not found" });

            // Prevent deleting templates that are referenced by shift instances
            var isUsed = await _context.ShiftInstances.AnyAsync(si => si.ShiftTemplateId == id);
            if (isUsed)
                return BadRequest(new { message = "Cannot delete shift template that is being used in shift instances" });

            _context.ShiftTemplates.Remove(template);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

