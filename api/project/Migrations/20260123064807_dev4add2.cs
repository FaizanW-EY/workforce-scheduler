using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class dev4add2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AttendanceLogs_ShiftAssignments_ShiftAssignmentAssignmentId",
                table: "AttendanceLogs");

            migrationBuilder.DropIndex(
                name: "IX_AttendanceLogs_ShiftAssignmentAssignmentId",
                table: "AttendanceLogs");

            migrationBuilder.DropColumn(
                name: "ShiftAssignmentAssignmentId",
                table: "AttendanceLogs");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceLogs_AssignmentId",
                table: "AttendanceLogs",
                column: "AssignmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_AttendanceLogs_ShiftAssignments_AssignmentId",
                table: "AttendanceLogs",
                column: "AssignmentId",
                principalTable: "ShiftAssignments",
                principalColumn: "AssignmentId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AttendanceLogs_ShiftAssignments_AssignmentId",
                table: "AttendanceLogs");

            migrationBuilder.DropIndex(
                name: "IX_AttendanceLogs_AssignmentId",
                table: "AttendanceLogs");

            migrationBuilder.AddColumn<Guid>(
                name: "ShiftAssignmentAssignmentId",
                table: "AttendanceLogs",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceLogs_ShiftAssignmentAssignmentId",
                table: "AttendanceLogs",
                column: "ShiftAssignmentAssignmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_AttendanceLogs_ShiftAssignments_ShiftAssignmentAssignmentId",
                table: "AttendanceLogs",
                column: "ShiftAssignmentAssignmentId",
                principalTable: "ShiftAssignments",
                principalColumn: "AssignmentId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
