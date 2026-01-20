using api.Dtos;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShiftInstancesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ShiftInstancesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/shiftinstances?from=2026-01-01&to=2026-01-31
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShiftInstance>>> GetShiftInstances(
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to)
        {
            var query = _context.ShiftInstances
                .Include(si => si.ShiftTemplate)
                .AsQueryable();

            if (from.HasValue)
                query = query.Where(si => si.ShiftDate >= from.Value.Date);

            if (to.HasValue)
                query = query.Where(si => si.ShiftDate <= to.Value.Date);

            return await query
                .OrderBy(si => si.ShiftDate)
                .ThenBy(si => si.ShiftTemplate.StartTime)
                .ToListAsync();
        }

        // GET: api/shiftinstances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShiftInstance>> GetShiftInstance(int id)
        {
            var shift = await _context.ShiftInstances
                .Include(si => si.ShiftTemplate)
                .FirstOrDefaultAsync(si => si.Id == id);

            if (shift == null)
                return NotFound(new { message = "Shift instance not found." });

            return shift;
        }

        // POST: api/shiftinstances
        [HttpPost]
        public async Task<ActionResult<ShiftInstance>> CreateShiftInstance([FromBody] ShiftInstanceDto dto)
        {
            // Validate template exists
            var templateExists = await _context.ShiftTemplates.AnyAsync(t => t.Id == dto.ShiftTemplateId);
            if (!templateExists)
                return BadRequest(new { message = "Invalid shift template." });

            // Validate date
            if (dto.ShiftDate.Date < DateTime.Today)
                return BadRequest(new { message = "Shift date cannot be in the past." });

            // Validate override
            if (dto.RequiredHeadcountOverride.HasValue && dto.RequiredHeadcountOverride.Value <= 0)
                return BadRequest(new { message = "RequiredHeadcountOverride must be greater than 0 if provided." });

            var shift = new ShiftInstance
            {
                ShiftTemplateId = dto.ShiftTemplateId,
                ShiftDate = dto.ShiftDate.Date,
                RequiredHeadcountOverride = dto.RequiredHeadcountOverride
            };

            _context.ShiftInstances.Add(shift);
            await _context.SaveChangesAsync();

            // Return with template info for UI convenience
            var created = await _context.ShiftInstances
                .Include(si => si.ShiftTemplate)
                .FirstAsync(si => si.Id == shift.Id);

            return CreatedAtAction(nameof(GetShiftInstance), new { id = created.Id }, created);
        }

        // PUT: api/shiftinstances/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateShiftInstance(int id, [FromBody] ShiftInstanceDto dto)
        {
            var shift = await _context.ShiftInstances.FindAsync(id);
            if (shift == null)
                return NotFound(new { message = "Shift instance not found." });

            // Validate template exists
            var templateExists = await _context.ShiftTemplates.AnyAsync(t => t.Id == dto.ShiftTemplateId);
            if (!templateExists)
                return BadRequest(new { message = "Invalid shift template." });

            // Validate date
            if (dto.ShiftDate.Date < DateTime.Today)
                return BadRequest(new { message = "Shift date cannot be in the past." });

            // Validate override
            if (dto.RequiredHeadcountOverride.HasValue && dto.RequiredHeadcountOverride.Value <= 0)
                return BadRequest(new { message = "RequiredHeadcountOverride must be greater than 0 if provided." });

            shift.ShiftTemplateId = dto.ShiftTemplateId;
            shift.ShiftDate = dto.ShiftDate.Date;
            shift.RequiredHeadcountOverride = dto.RequiredHeadcountOverride;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/shiftinstances/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShiftInstance(int id)
        {
            var shift = await _context.ShiftInstances.FindAsync(id);
            if (shift == null)
                return NotFound(new { message = "Shift instance not found." });

            _context.ShiftInstances.Remove(shift);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}


