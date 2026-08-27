#nullable disable

using Microsoft.EntityFrameworkCore;
using TrumpVerseAPI.Models;

namespace TrumpVerseAPI.Contexts;

public class TrumpContext : DbContext
{
    public TrumpContext(DbContextOptions<TrumpContext> options) 
        :base(options){}

    public DbSet<TrumpMerch> Merch { get; set; }
}