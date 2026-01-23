using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class ShiftDbContext : DbContext
    {
        public ShiftDbContext(DbContextOptions<ShiftDbContext> options) : base(options) { }


        public DbSet<ShiftAssignment> ShiftAssignments { get; set; }
        public DbSet<ShiftInstance> ShiftInstances { get; set; }
        public DbSet<ShiftTemplate> ShiftTemplates { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Availability> Availabilities { get; set; }
        public DbSet<SchedulingRule> SchedulingRules { get; set; }
        public DbSet<AttendanceLog> AttendanceLogs { get; set; }
        public DbSet<UtilizationSummary> UtilizationSummaries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)

        {

            base.OnModelCreating(modelBuilder);



            modelBuilder.Entity<AttendanceLog>()

                .HasOne(a => a.ShiftAssignment)

                .WithMany()

                .HasForeignKey(a => a.AssignmentId)

                .OnDelete(DeleteBehavior.Restrict);







        }
    }
}
