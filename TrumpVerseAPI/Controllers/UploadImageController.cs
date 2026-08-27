using Microsoft.AspNetCore.Mvc;

namespace TrumpVerseAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadImageController : ControllerBase
{
    private readonly IWebHostEnvironment _webHostEnvironment;

    public UploadImageController(IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
    }

    [HttpPost]
    public async Task<IActionResult> Post(IFormFile file)
    {
        try
        {
            if(file == null || file.Length == 0)
            {
                return StatusCode(StatusCodes.Status400BadRequest);
            }

            string WebRootPath = _webHostEnvironment.WebRootPath;
            string absolutePath = Path.Combine(WebRootPath, "images", file.FileName);

            using (var fileStream = new FileStream(absolutePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
            return Created();
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error, cant post the image.");
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put(IFormFile file)
    {
        try
        {
            if(file == null || file.Length == 0)
            {
                return StatusCode(StatusCodes.Status400BadRequest);
            }
            string WebRootPath = _webHostEnvironment.WebRootPath;
            string absolutePath = Path.Combine(WebRootPath, "images", file.FileName);

            using (var fileStream = new FileStream(absolutePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
            return Created();
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error, cant edit the image.");
        }
    }
}