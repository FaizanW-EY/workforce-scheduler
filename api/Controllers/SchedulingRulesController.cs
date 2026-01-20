
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchedulingRulesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SchedulingRulesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/schedulingrules
        // Returns all rules (usually only 1 record)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SchedulingRule>>> GetSchedulingRules()
        {
            var rules = await _context.SchedulingRules.ToListAsync();

            if (!rules.Any())
            {
                return NotFound(new { message = "Scheduling rules not configured." });
            }

            return rules;
        }

        // GET: api/schedulingrules/active
        // Returns the active rule (first and only record)
        [HttpGet("active")]
        public async Task<ActionResult<SchedulingRule>> GetActiveSchedulingRule()
        {
            var rule = await _context.SchedulingRules.FirstOrDefaultAsync();

            if (rule == null)
            {
                return NotFound(new { message = "No scheduling rules available." });
            }

            return rule;
        }

        // GET: api/schedulingrules/5
        // Read-only detail endpoint
        [HttpGet("{id}")]
        public async Task<ActionResult<SchedulingRule>> GetSchedulingRule(int id)
        {
            var rule = await _context.SchedulingRules.FindAsync(id);

            if (rule == null)
            {
                return NotFound(new { message = "Scheduling rule not found." });
            }

            return rule;
        }

        // Post/Put/Delete are intentionally removed to make rules read-only.
    }
}
