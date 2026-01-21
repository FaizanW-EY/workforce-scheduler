using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class thirdcreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShiftAssignments_Users_EmployeeId1",
                table: "ShiftAssignments");

            migrationBuilder.DropIndex(
                name: "IX_ShiftAssignments_EmployeeId1",
                table: "ShiftAssignments");

            migrationBuilder.DropColumn(
                name: "EmployeeId1",
                table: "ShiftAssignments");

            migrationBuilder.AlterColumn<int>(
                name: "EmployeeId",
                table: "ShiftAssignments",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftAssignments_EmployeeId",
                table: "ShiftAssignments",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShiftAssignments_Users_EmployeeId",
                table: "ShiftAssignments",
                column: "EmployeeId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShiftAssignments_Users_EmployeeId",
                table: "ShiftAssignments");

            migrationBuilder.DropIndex(
                name: "IX_ShiftAssignments_EmployeeId",
                table: "ShiftAssignments");

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeId",
                table: "ShiftAssignments",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "EmployeeId1",
                table: "ShiftAssignments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ShiftAssignments_EmployeeId1",
                table: "ShiftAssignments",
                column: "EmployeeId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ShiftAssignments_Users_EmployeeId1",
                table: "ShiftAssignments",
                column: "EmployeeId1",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
