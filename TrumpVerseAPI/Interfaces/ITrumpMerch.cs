namespace TrumpVerseAPI.Interfaces;

interface ITrumpMerch
{
    int Id { get; set; }
    string Name { get; set; }
    double Price { get; set; }
    string Category {  get; set; }
    string Description { get; set; }
    string Image { get; set; }
}