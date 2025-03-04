using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedSync.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserMedicationRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMedications_Medications_MedicationsId",
                table: "UserMedications");

            migrationBuilder.DropForeignKey(
                name: "FK_UserMedications_Users_UsersId",
                table: "UserMedications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserMedications",
                table: "UserMedications");

            migrationBuilder.RenameColumn(
                name: "UsersId",
                table: "UserMedications",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "MedicationsId",
                table: "UserMedications",
                newName: "MedicationId");

            migrationBuilder.RenameIndex(
                name: "IX_UserMedications_UsersId",
                table: "UserMedications",
                newName: "IX_UserMedications_UserId");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "UserMedications",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserMedications",
                table: "UserMedications",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserMedications_MedicationId",
                table: "UserMedications",
                column: "MedicationId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMedications_Medications_MedicationId",
                table: "UserMedications",
                column: "MedicationId",
                principalTable: "Medications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserMedications_Users_UserId",
                table: "UserMedications",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMedications_Medications_MedicationId",
                table: "UserMedications");

            migrationBuilder.DropForeignKey(
                name: "FK_UserMedications_Users_UserId",
                table: "UserMedications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserMedications",
                table: "UserMedications");

            migrationBuilder.DropIndex(
                name: "IX_UserMedications_MedicationId",
                table: "UserMedications");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "UserMedications");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "UserMedications",
                newName: "UsersId");

            migrationBuilder.RenameColumn(
                name: "MedicationId",
                table: "UserMedications",
                newName: "MedicationsId");

            migrationBuilder.RenameIndex(
                name: "IX_UserMedications_UserId",
                table: "UserMedications",
                newName: "IX_UserMedications_UsersId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserMedications",
                table: "UserMedications",
                columns: new[] { "MedicationsId", "UsersId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserMedications_Medications_MedicationsId",
                table: "UserMedications",
                column: "MedicationsId",
                principalTable: "Medications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserMedications_Users_UsersId",
                table: "UserMedications",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
