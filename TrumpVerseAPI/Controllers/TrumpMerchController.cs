using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrumpVerseAPI.Contexts;
using TrumpVerseAPI.Models;

namespace TrumpVerseAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrumpMerchController : ControllerBase
{
    private readonly TrumpContext _trumpContext;

    public TrumpMerchController(TrumpContext trumpContext)
    {
        _trumpContext = trumpContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<TrumpMerch>>> Get()
    {
        try
        {
            List<TrumpMerch> trumpMerch = await _trumpContext.Merch.ToListAsync();
            return Ok(trumpMerch);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error - could not get merch in TrumpMerchController.");
        }
    }

    [HttpGet("{Id}")]
    public async Task<ActionResult<TrumpMerch>> Get(int Id)
    {
        try
        {
            TrumpMerch? trumpMerch = await _trumpContext.Merch.FindAsync(Id);
            if (trumpMerch != null)
            { 
                return Ok(trumpMerch);
            }
            else
            {
                return NotFound($"Did not find ID: {Id}");
            }
        }
        catch
        {
             return StatusCode(StatusCodes.Status500InternalServerError, $"Error - could not get merch in TrumpMerchController by ID: {Id}");
        }
    }

    [HttpGet("[action]/{name}")]
    public async Task<ActionResult<List<TrumpMerch>>> GetByName(string name)
    {
        try
        {
            List<TrumpMerch> trumpMerch = await _trumpContext.Merch.Where(
                merch => merch.Name != null && merch.Name.ToLower().Contains(name.ToLower())
            ).ToListAsync();
            
            if (trumpMerch != null)
            {
                return Ok(trumpMerch);
            }
            else
            {
                return NotFound($"Did not find name: {name}");
            }
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error - could not get merch in TrumpMerchController by name: {name}");
        }
    }

    [HttpPost]
    public async Task<ActionResult<TrumpMerch>> Post(TrumpMerch newTrumpMerch)
    {   
        try
        {
            _trumpContext.Merch.Add(newTrumpMerch);
            await _trumpContext.SaveChangesAsync();
            return CreatedAtAction("Get", new {id = newTrumpMerch.Id}, newTrumpMerch);
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error - could not create new merch in TrumpMerchController.");
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(TrumpMerch editedTrumpMerch)
    {
        try
        {
            _trumpContext.Entry(editedTrumpMerch).State = EntityState.Modified;
            await _trumpContext.SaveChangesAsync();
            return NoContent();
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error - could not edit merch in TrumpMerchController.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            TrumpMerch? trumpMerch = await _trumpContext.Merch.FindAsync(id);
            if (trumpMerch != null)
            {
                _trumpContext.Merch.Remove(trumpMerch);
                await _trumpContext.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                return NotFound($"Did not find ID to delete: {id}");
            }
        }
        catch
        {
           return StatusCode(StatusCodes.Status500InternalServerError, "Error - could not delete merch in TrumpMerchController.");
        }
    }
}   
