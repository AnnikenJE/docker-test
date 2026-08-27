using TrumpVerseAPI.Interfaces;

namespace TrumpVerseAPI.Models;

public class TrumpMerch : ITrumpMerch
{
    public int Id  { get; set; }
    public required string Name { get; set; }
    public required double Price { get; set; }
    public required string Category { get; set; }
    public required string Description { get; set; }
    public required string Image { get; set; }
}