using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ShiftTemplate> ShiftTemplates { get; set; }
        public DbSet<SchedulingRule> SchedulingRules { get; set; }
        public DbSet<ShiftInstance> ShiftInstances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<ShiftTemplate>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.StartTime)
                    .IsRequired();

                entity.Property(e => e.EndTime)
                    .IsRequired();

                entity.Property(e => e.BreakMinutes)
                    .IsRequired();

                entity.Property(e => e.RequiredHeadcount)
                    .IsRequired();
            });


            modelBuilder.Entity<ShiftInstance>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.ShiftDate)
                    .IsRequired();

                entity.HasOne(e => e.ShiftTemplate)
                    .WithMany()
                    .HasForeignKey(e => e.ShiftTemplateId)
                    .OnDelete(DeleteBehavior.Restrict);
                // Prevent deleting a template if shift instances exist
            });

            modelBuilder.Entity<SchedulingRule>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.MaxDailyHours)
                    .IsRequired();

                entity.Property(e => e.MaxWeeklyHours)
                    .IsRequired();

                entity.Property(e => e.MinRestPeriodHours)
                    .IsRequired();

                entity.Property(e => e.OvertimeThresholdWeeklyHours)
                    .IsRequired();
            });

            modelBuilder.Entity<SchedulingRule>().HasData(
                new SchedulingRule
                {
                    Id = 1,
                    MaxDailyHours = 9,
                    MaxWeeklyHours = 45,
                    MinRestPeriodHours = 12,
                    OvertimeThresholdWeeklyHours = 50
                }
            );
        }
    }
}