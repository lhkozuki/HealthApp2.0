using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MedSync.Backend.Entities;
using Microsoft.EntityFrameworkCore;


namespace MedSync.Backend.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Medication> Medications { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            // Configurar o relacionamento entre User e Medication
            modelBuilder.Entity<Medication>()
                .HasOne(um => um.User)
                .WithMany(u => u.Medications)
                .HasForeignKey(um => um.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}