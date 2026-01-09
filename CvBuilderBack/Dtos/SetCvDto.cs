using System.ComponentModel.DataAnnotations;

namespace CvBuilderBack.Dtos;

public class SetCvDto
{
    public int CvId { get; init; }
    
    [MaxLength(int.MaxValue)]
    public string Content { get; init; } = string.Empty;
}