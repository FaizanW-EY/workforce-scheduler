using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SchedulingRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaxDailyHours = table.Column<int>(type: "int", nullable: false),
                    MaxWeeklyHours = table.Column<int>(type: "int", nullable: false),
                    MinRestPeriodHours = table.Column<int>(type: "int", nullable: false),
                    OvertimeThresholdWeeklyHours = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchedulingRules", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShiftTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    BreakMinutes = table.Column<int>(type: "int", nullable: false),
                    RequiredHeadcount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShiftTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShiftInstances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShiftTemplateId = table.Column<int>(type: "int", nullable: false),
                    ShiftDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RequiredHeadcountOverride = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShiftInstances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShiftInstances_ShiftTemplates_ShiftTemplateId",
                        column: x => x.ShiftTemplateId,
                        principalTable: "ShiftTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "SchedulingRules",
                columns: new[] { "Id", "MaxDailyHours", "MaxWeeklyHours", "MinRestPeriodHours", "OvertimeThresholdWeeklyHours" },
                values: new object[] { 1, 9, 45, 12, 50 });

            migrationBuilder.CreateIndex(
                name: "IX_ShiftInstances_ShiftTemplateId",
                table: "ShiftInstances",
                column: "ShiftTemplateId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SchedulingRules");

            migrationBuilder.DropTable(
                name: "ShiftInstances");

            migrationBuilder.DropTable(
                name: "ShiftTemplates");
        }
    }
}
